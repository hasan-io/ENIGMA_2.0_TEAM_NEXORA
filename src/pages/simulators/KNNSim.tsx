import { useState, useMemo, useCallback } from 'react';
<<<<<<< HEAD
import { SimulatorLayout } from '@/components/simulator/SimulatorLayout';
=======
import { AppLayout } from '@/components/layout/AppLayout';
>>>>>>> 2e31993a8f50f3c24a0ea934fdf5039eb59ed03f
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';

function generateData() {
  const pts: { x: number; y: number; label: number }[] = [];
  // Cluster 1 (blue)
  for (let i = 0; i < 20; i++) {
    pts.push({ x: 2 + (Math.random() - 0.5) * 3, y: 2 + (Math.random() - 0.5) * 3, label: 0 });
  }
  // Cluster 2 (red)
  for (let i = 0; i < 20; i++) {
    pts.push({ x: 7 + (Math.random() - 0.5) * 3, y: 7 + (Math.random() - 0.5) * 3, label: 1 });
  }
  return pts;
}

export default function KNNSim() {
  const [data, setData] = useState(generateData);
  const [k, setK] = useState(3);
  const [testPoint, setTestPoint] = useState<{ x: number; y: number } | null>(null);

  const svgW = 500, svgH = 400, pad = 40;
  const toSvgX = (x: number) => pad + (x / 10) * (svgW - 2 * pad);
  const toSvgY = (y: number) => svgH - pad - (y / 10) * (svgH - 2 * pad);
  const fromSvgX = (sx: number) => ((sx - pad) / (svgW - 2 * pad)) * 10;
  const fromSvgY = (sy: number) => ((svgH - pad - sy) / (svgH - 2 * pad)) * 10;

  const classification = useMemo(() => {
    if (!testPoint) return null;
    const dists = data.map(p => ({
      ...p,
      dist: Math.sqrt((p.x - testPoint.x) ** 2 + (p.y - testPoint.y) ** 2),
    })).sort((a, b) => a.dist - b.dist);
    const neighbors = dists.slice(0, k);
    const votes = neighbors.reduce((acc, n) => {
      acc[n.label] = (acc[n.label] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);
    const prediction = (votes[1] || 0) > (votes[0] || 0) ? 1 : 0;
    return { prediction, neighbors };
  }, [data, k, testPoint]);

  const handleSvgClick = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const scaleX = svgW / rect.width;
    const scaleY = svgH / rect.height;
    const sx = (e.clientX - rect.left) * scaleX;
    const sy = (e.clientY - rect.top) * scaleY;
    setTestPoint({ x: +fromSvgX(sx).toFixed(2), y: +fromSvgY(sy).toFixed(2) });
  }, []);

  return (
<<<<<<< HEAD
    <SimulatorLayout topicId="knn" topicName="K-Nearest Neighbors">
      <h1 className="text-2xl font-bold font-display mb-1 text-foreground">K-Nearest Neighbors</h1>
      <p className="text-muted-foreground text-sm mb-6">Click on the chart to place a test point, then adjust K.</p>
=======
    <AppLayout>
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <h1 className="text-2xl font-bold font-display mb-1 text-foreground">K-Nearest Neighbors</h1>
        <p className="text-muted-foreground text-sm mb-6">Click on the chart to place a test point, then adjust K.</p>
>>>>>>> 2e31993a8f50f3c24a0ea934fdf5039eb59ed03f

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-card border border-border rounded-xl p-4">
            <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full h-auto cursor-crosshair" onClick={handleSvgClick}>
              <rect width={svgW} height={svgH} fill="none" />
              {/* Grid lines */}
              {Array.from({ length: 11 }, (_, i) => i).map(v => (
                <g key={v}>
                  <line x1={toSvgX(v)} y1={pad} x2={toSvgX(v)} y2={svgH - pad} stroke="hsl(220,15%,90%)" strokeWidth={0.5} />
                  <line x1={pad} y1={toSvgY(v)} x2={svgW - pad} y2={toSvgY(v)} stroke="hsl(220,15%,90%)" strokeWidth={0.5} />
                </g>
              ))}
              {/* Neighbor lines */}
              {classification?.neighbors.map((n, i) => (
                <line key={i} x1={toSvgX(testPoint!.x)} y1={toSvgY(testPoint!.y)}
                  x2={toSvgX(n.x)} y2={toSvgY(n.y)} stroke="hsl(220,10%,70%)" strokeWidth={1} strokeDasharray="3 3" />
              ))}
              {/* Data points */}
              {data.map((p, i) => {
                const isNeighbor = classification?.neighbors.some(n => n.x === p.x && n.y === p.y);
                return (
                  <circle key={i} cx={toSvgX(p.x)} cy={toSvgY(p.y)} r={isNeighbor ? 7 : 5}
                    fill={p.label === 0 ? 'hsl(230, 75%, 55%)' : 'hsl(0, 84%, 60%)'}
                    stroke={isNeighbor ? 'hsl(38, 92%, 50%)' : 'none'} strokeWidth={2} opacity={0.85} />
                );
              })}
              {/* Test point */}
              {testPoint && (
                <g>
                  <circle cx={toSvgX(testPoint.x)} cy={toSvgY(testPoint.y)} r={9}
                    fill={classification?.prediction === 1 ? 'hsl(0, 84%, 60%)' : 'hsl(230, 75%, 55%)'}
                    stroke="hsl(38, 92%, 50%)" strokeWidth={3} />
                  <circle cx={toSvgX(testPoint.x)} cy={toSvgY(testPoint.y)} r={3} fill="hsl(0, 0%, 100%)" />
                </g>
              )}
            </svg>
          </div>

          <div className="space-y-6">
            <div className="bg-card border border-border rounded-xl p-5 shadow-card">
              <label className="text-sm font-medium text-foreground">K: {k}</label>
              <Slider value={[k]} onValueChange={v => setK(v[0])} min={1} max={15} step={1} className="mt-2 mb-4" />
              {classification && (
                <div className="bg-muted rounded-lg p-4 text-center">
                  <p className="text-xs text-muted-foreground mb-1">Prediction</p>
                  <p className="text-xl font-bold font-display" style={{ color: classification.prediction === 1 ? 'hsl(0, 84%, 60%)' : 'hsl(230, 75%, 55%)' }}>
                    Class {classification.prediction}
                  </p>
                </div>
              )}
              {!testPoint && (
                <p className="text-sm text-muted-foreground text-center mt-4">Click on the chart to classify a point</p>
              )}
            </div>
            <div className="bg-card border border-border rounded-xl p-5 shadow-card text-sm text-muted-foreground">
              <p className="font-medium text-foreground mb-2">Algorithm</p>
              <p>1. Calculate Euclidean distance</p>
              <p>2. Sort by distance</p>
              <p>3. Pick K nearest</p>
              <p>4. Majority vote</p>
            </div>
          </div>
<<<<<<< HEAD
      </div>
    </SimulatorLayout>
=======
        </div>
      </div>
    </AppLayout>
>>>>>>> 2e31993a8f50f3c24a0ea934fdf5039eb59ed03f
  );
}
