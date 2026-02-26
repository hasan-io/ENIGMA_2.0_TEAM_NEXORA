import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { SimulatorLayout } from '@/components/simulator/SimulatorLayout';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';

function generateData(n = 20) {
  const pts: { x: number; y: number }[] = [];
  // 4 natural clusters
  const centers = [{ x: 2, y: 8 }, { x: 8, y: 2 }, { x: 8, y: 8 }, { x: 3, y: 3 }];
  for (let i = 0; i < n; i++) {
    const c = centers[i % centers.length];
    pts.push({ x: c.x + (Math.random() - 0.5) * 2, y: c.y + (Math.random() - 0.5) * 2 });
  }
  return pts;
}

type Linkage = 'single' | 'complete' | 'average';

interface MergeStep {
  i: number;
  j: number;
  distance: number;
}

function computeDistance(a: { x: number; y: number }, b: { x: number; y: number }) {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

function hierarchicalCluster(data: { x: number; y: number }[], linkage: Linkage) {
  const n = data.length;
  let clusters: number[][] = data.map((_, i) => [i]);
  const merges: MergeStep[] = [];

  while (clusters.length > 1) {
    let minDist = Infinity, mi = -1, mj = -1;
    for (let i = 0; i < clusters.length; i++) {
      for (let j = i + 1; j < clusters.length; j++) {
        let dist: number;
        const dists = clusters[i].flatMap(a => clusters[j].map(b => computeDistance(data[a], data[b])));
        if (linkage === 'single') dist = Math.min(...dists);
        else if (linkage === 'complete') dist = Math.max(...dists);
        else dist = dists.reduce((s, d) => s + d, 0) / dists.length;

        if (dist < minDist) { minDist = dist; mi = i; mj = j; }
      }
    }
    merges.push({ i: mi, j: mj, distance: minDist });
    clusters[mi] = [...clusters[mi], ...clusters[mj]];
    clusters.splice(mj, 1);
  }
  return merges;
}

function getClusters(data: { x: number; y: number }[], merges: MergeStep[], cutLevel: number) {
  const n = data.length;
  let clusters: number[][] = data.map((_, i) => [i]);
  const numMerges = Math.max(0, n - cutLevel);
  for (let m = 0; m < Math.min(numMerges, merges.length); m++) {
    const { i, j } = merges[m];
    if (i < clusters.length && j < clusters.length) {
      clusters[i] = [...clusters[i], ...clusters[j]];
      clusters.splice(j, 1);
    }
  }
  return clusters;
}

const COLORS = ['hsl(230, 75%, 55%)', 'hsl(0, 84%, 60%)', 'hsl(175, 75%, 38%)', 'hsl(38, 92%, 50%)', 'hsl(280, 70%, 55%)', 'hsl(340, 70%, 55%)'];

export default function HierarchicalClusteringSim() {
  const [data] = useState(generateData);
  const [linkage, setLinkage] = useState<Linkage>('single');
  const [cutLevel, setCutLevel] = useState(4);

  const merges = useMemo(() => hierarchicalCluster(data, linkage), [data, linkage]);
  const clusters = useMemo(() => getClusters(data, merges, cutLevel), [data, merges, cutLevel]);

  const pointColors = useMemo(() => {
    const colors = new Array(data.length).fill(0);
    clusters.forEach((cluster, ci) => {
      cluster.forEach(idx => { colors[idx] = ci; });
    });
    return colors;
  }, [data.length, clusters]);

  const svgW = 500, svgH = 400, pad = 40;
  const toSvgX = (x: number) => pad + (x / 10) * (svgW - 2 * pad);
  const toSvgY = (y: number) => svgH - pad - (y / 10) * (svgH - 2 * pad);

  // Simple dendrogram
  const dendroH = 150;

  return (
    <SimulatorLayout topicId="hierarchical-clustering" topicName="Hierarchical Clustering">
      <h1 className="text-2xl font-bold font-display mb-1 text-foreground">Hierarchical Clustering</h1>
      <p className="text-muted-foreground text-sm mb-6">Watch clusters merge and cut the dendrogram at different levels.</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-card border border-border rounded-xl p-4">
            <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full h-auto">
              <rect width={svgW} height={svgH} fill="none" />
              {data.map((p, i) => (
                <circle key={i} cx={toSvgX(p.x)} cy={toSvgY(p.y)} r={6}
                  fill={COLORS[pointColors[i] % COLORS.length]} opacity={0.85}
                  stroke="white" strokeWidth={1} />
              ))}
            </svg>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-card border border-border rounded-xl p-5 shadow-card">
            <div className="mb-4">
              <label className="text-sm font-medium text-foreground">Clusters (cut level): {cutLevel}</label>
              <Slider value={[cutLevel]} onValueChange={v => setCutLevel(v[0])} min={1} max={data.length} step={1} className="mt-2" />
            </div>
            <div className="mb-4">
              <p className="text-sm font-medium text-foreground mb-2">Linkage</p>
              <div className="flex gap-1.5">
                {(['single', 'complete', 'average'] as Linkage[]).map(l => (
                  <Button key={l} size="sm" variant={linkage === l ? 'default' : 'outline'}
                    onClick={() => setLinkage(l)}
                    className={`flex-1 text-xs ${linkage === l ? 'gradient-primary text-primary-foreground' : ''}`}>
                    {l.charAt(0).toUpperCase() + l.slice(1)}
                  </Button>
                ))}
              </div>
            </div>
            <div className="bg-muted rounded-lg p-3 text-center">
              <p className="text-xs text-muted-foreground mb-1">Current Clusters</p>
              <p className="text-2xl font-bold font-display text-foreground">{clusters.length}</p>
            </div>
          </div>
          <div className="bg-card border border-border rounded-xl p-5 shadow-card text-sm text-muted-foreground">
            <p className="font-medium text-foreground mb-2">Linkage Methods</p>
            <p><strong className="text-foreground">Single</strong>: min distance</p>
            <p><strong className="text-foreground">Complete</strong>: max distance</p>
            <p><strong className="text-foreground">Average</strong>: mean distance</p>
          </div>
        </div>
      </div>
    </SimulatorLayout>
  );
}
