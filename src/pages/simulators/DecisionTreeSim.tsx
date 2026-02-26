import { useState, useMemo, useCallback } from 'react';
import { SimulatorLayout } from '@/components/simulator/SimulatorLayout';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';

interface TreeNode {
  featureIdx?: number;
  threshold?: number;
  left?: TreeNode;
  right?: TreeNode;
  prediction?: number;
  depth: number;
  samples: number;
}

function generateData(n = 80) {
  const pts: { x: number; y: number; label: number }[] = [];
  for (let i = 0; i < n; i++) {
    const x = Math.random() * 10;
    const y = Math.random() * 10;
    const label = (x > 5 && y > 4) || (x < 4 && y > 6) ? 1 : 0;
    const noisy = Math.random() < 0.08 ? 1 - label : label;
    pts.push({ x: +x.toFixed(2), y: +y.toFixed(2), label: noisy });
  }
  return pts;
}

function gini(labels: number[]) {
  if (labels.length === 0) return 0;
  const p1 = labels.filter(l => l === 1).length / labels.length;
  return 1 - p1 * p1 - (1 - p1) * (1 - p1);
}

function entropy(labels: number[]) {
  if (labels.length === 0) return 0;
  const p1 = labels.filter(l => l === 1).length / labels.length;
  if (p1 === 0 || p1 === 1) return 0;
  return -(p1 * Math.log2(p1) + (1 - p1) * Math.log2(1 - p1));
}

function buildTree(
  data: { x: number; y: number; label: number }[],
  maxDepth: number,
  minSamples: number,
  metric: 'gini' | 'entropy',
  depth = 0
): TreeNode {
  const labels = data.map(d => d.label);
  const majority = labels.filter(l => l === 1).length > labels.length / 2 ? 1 : 0;

  if (depth >= maxDepth || data.length < minSamples || new Set(labels).size === 1) {
    return { prediction: majority, depth, samples: data.length };
  }

  const impurityFn = metric === 'gini' ? gini : entropy;
  let bestGain = -1, bestFeature = 0, bestThreshold = 0;

  for (const featureIdx of [0, 1]) {
    const values = [...new Set(data.map(d => featureIdx === 0 ? d.x : d.y))].sort((a, b) => a - b);
    for (let i = 0; i < values.length - 1; i++) {
      const threshold = (values[i] + values[i + 1]) / 2;
      const left = data.filter(d => (featureIdx === 0 ? d.x : d.y) <= threshold);
      const right = data.filter(d => (featureIdx === 0 ? d.x : d.y) > threshold);
      if (left.length === 0 || right.length === 0) continue;

      const parentImpurity = impurityFn(labels);
      const gain = parentImpurity -
        (left.length / data.length) * impurityFn(left.map(d => d.label)) -
        (right.length / data.length) * impurityFn(right.map(d => d.label));

      if (gain > bestGain) {
        bestGain = gain;
        bestFeature = featureIdx;
        bestThreshold = threshold;
      }
    }
  }

  if (bestGain <= 0) return { prediction: majority, depth, samples: data.length };

  const leftData = data.filter(d => (bestFeature === 0 ? d.x : d.y) <= bestThreshold);
  const rightData = data.filter(d => (bestFeature === 0 ? d.x : d.y) > bestThreshold);

  return {
    featureIdx: bestFeature,
    threshold: bestThreshold,
    left: buildTree(leftData, maxDepth, minSamples, metric, depth + 1),
    right: buildTree(rightData, maxDepth, minSamples, metric, depth + 1),
    depth,
    samples: data.length,
  };
}

function getSplitLines(node: TreeNode, bounds = { xMin: 0, xMax: 10, yMin: 0, yMax: 10 }): { x1: number; y1: number; x2: number; y2: number; depth: number }[] {
  if (node.prediction !== undefined) return [];
  const lines: { x1: number; y1: number; x2: number; y2: number; depth: number }[] = [];

  if (node.featureIdx === 0) {
    lines.push({ x1: node.threshold!, y1: bounds.yMin, x2: node.threshold!, y2: bounds.yMax, depth: node.depth });
    if (node.left) lines.push(...getSplitLines(node.left, { ...bounds, xMax: node.threshold! }));
    if (node.right) lines.push(...getSplitLines(node.right, { ...bounds, xMin: node.threshold! }));
  } else {
    lines.push({ x1: bounds.xMin, y1: node.threshold!, x2: bounds.xMax, y2: node.threshold!, depth: node.depth });
    if (node.left) lines.push(...getSplitLines(node.left, { ...bounds, yMax: node.threshold! }));
    if (node.right) lines.push(...getSplitLines(node.right, { ...bounds, yMin: node.threshold! }));
  }
  return lines;
}

export default function DecisionTreeSim() {
  const [data] = useState(generateData);
  const [maxDepth, setMaxDepth] = useState(3);
  const [minSamples, setMinSamples] = useState(5);
  const [metric, setMetric] = useState<'gini' | 'entropy'>('gini');

  const tree = useMemo(() => buildTree(data, maxDepth, minSamples, metric), [data, maxDepth, minSamples, metric]);
  const splitLines = useMemo(() => getSplitLines(tree), [tree]);

  const svgW = 500, svgH = 400, pad = 40;
  const toSvgX = (x: number) => pad + (x / 10) * (svgW - 2 * pad);
  const toSvgY = (y: number) => svgH - pad - (y / 10) * (svgH - 2 * pad);

  const depthColors = ['hsl(175, 75%, 38%)', 'hsl(230, 75%, 55%)', 'hsl(38, 92%, 50%)', 'hsl(0, 84%, 60%)', 'hsl(280, 70%, 55%)'];

  return (
    <SimulatorLayout topicId="decision-tree" topicName="Decision Tree">
      <h1 className="text-2xl font-bold font-display mb-1 text-foreground">Decision Tree Classifier</h1>
      <p className="text-muted-foreground text-sm mb-6">Watch how the tree partitions space with horizontal and vertical splits.</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card border border-border rounded-xl p-4">
          <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full h-auto">
            <rect width={svgW} height={svgH} fill="none" />
            {/* Split lines */}
            {splitLines.map((l, i) => (
              <line key={i} x1={toSvgX(l.x1)} y1={toSvgY(l.y1)} x2={toSvgX(l.x2)} y2={toSvgY(l.y2)}
                stroke={depthColors[l.depth % depthColors.length]} strokeWidth={2} strokeDasharray="4 2" />
            ))}
            {/* Data points */}
            {data.map((p, i) => (
              <circle key={i} cx={toSvgX(p.x)} cy={toSvgY(p.y)} r={4}
                fill={p.label === 1 ? 'hsl(230, 75%, 55%)' : 'hsl(0, 84%, 60%)'} opacity={0.8} />
            ))}
          </svg>
        </div>

        <div className="space-y-6">
          <div className="bg-card border border-border rounded-xl p-5 shadow-card">
            <div className="mb-4">
              <label className="text-sm font-medium text-foreground">Max Depth: {maxDepth}</label>
              <Slider value={[maxDepth]} onValueChange={v => setMaxDepth(v[0])} min={1} max={5} step={1} className="mt-2" />
            </div>
            <div className="mb-4">
              <label className="text-sm font-medium text-foreground">Min Samples: {minSamples}</label>
              <Slider value={[minSamples]} onValueChange={v => setMinSamples(v[0])} min={2} max={20} step={1} className="mt-2" />
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant={metric === 'gini' ? 'default' : 'outline'} onClick={() => setMetric('gini')} className={metric === 'gini' ? 'gradient-primary text-primary-foreground' : ''}>
                Gini
              </Button>
              <Button size="sm" variant={metric === 'entropy' ? 'default' : 'outline'} onClick={() => setMetric('entropy')} className={metric === 'entropy' ? 'gradient-primary text-primary-foreground' : ''}>
                Entropy
              </Button>
            </div>
            <div className="bg-muted rounded-lg p-3 text-center mt-4">
              <p className="text-xs text-muted-foreground mb-1">Splits Created</p>
              <p className="text-2xl font-bold font-display text-foreground">{splitLines.length}</p>
            </div>
          </div>
          <div className="bg-card border border-border rounded-xl p-5 shadow-card text-sm text-muted-foreground">
            <p className="font-medium text-foreground mb-2">Formulas</p>
            <p>Gini = 1 - Σpᵢ²</p>
            <p>Entropy = -Σpᵢ·log₂(pᵢ)</p>
          </div>
        </div>
      </div>
    </SimulatorLayout>
  );
}
