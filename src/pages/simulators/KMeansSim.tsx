import { useState, useCallback, useRef, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';

function generateData(n = 60) {
  const pts: { x: number; y: number }[] = [];
  const centers = [{ cx: 2, cy: 8 }, { cx: 8, cy: 2 }, { cx: 7, cy: 8 }];
  centers.forEach(c => {
    for (let i = 0; i < n / 3; i++) {
      pts.push({ x: c.cx + (Math.random() - 0.5) * 3, y: c.cy + (Math.random() - 0.5) * 3 });
    }
  });
  return pts;
}

const COLORS = ['hsl(230, 75%, 55%)', 'hsl(0, 84%, 60%)', 'hsl(175, 75%, 38%)', 'hsl(38, 92%, 50%)', 'hsl(280, 70%, 55%)'];

export default function KMeansSim() {
  const [data] = useState(generateData);
  const [k, setK] = useState(3);
  const [centroids, setCentroids] = useState<{ x: number; y: number }[]>([]);
  const [assignments, setAssignments] = useState<number[]>([]);
  const [iteration, setIteration] = useState(0);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const initCentroids = useCallback(() => {
    const c: { x: number; y: number }[] = [];
    for (let i = 0; i < k; i++) {
      c.push({ x: Math.random() * 10, y: Math.random() * 10 });
    }
    setCentroids(c);
    setAssignments([]);
    setIteration(0);
  }, [k]);

  const step = useCallback(() => {
    if (centroids.length === 0) return;

    // Assign points
    const newAssignments = data.map(p => {
      let minDist = Infinity, minIdx = 0;
      centroids.forEach((c, i) => {
        const d = Math.sqrt((p.x - c.x) ** 2 + (p.y - c.y) ** 2);
        if (d < minDist) { minDist = d; minIdx = i; }
      });
      return minIdx;
    });
    setAssignments(newAssignments);

    // Update centroids
    const newCentroids = centroids.map((_, i) => {
      const cluster = data.filter((_, j) => newAssignments[j] === i);
      if (cluster.length === 0) return centroids[i];
      return {
        x: cluster.reduce((s, p) => s + p.x, 0) / cluster.length,
        y: cluster.reduce((s, p) => s + p.y, 0) / cluster.length,
      };
    });
    setCentroids(newCentroids);
    setIteration(prev => prev + 1);
  }, [data, centroids]);

  const startAnimation = useCallback(() => {
    if (centroids.length === 0) initCentroids();
    setRunning(true);
  }, [centroids, initCentroids]);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => step(), 600);
      const timeout = setTimeout(() => {
        setRunning(false);
        if (intervalRef.current) clearInterval(intervalRef.current);
      }, 8000);
      return () => { clearTimeout(timeout); if (intervalRef.current) clearInterval(intervalRef.current); };
    }
  }, [running, step]);

  const svgW = 500, svgH = 400, pad = 40;
  const toSvgX = (x: number) => pad + (x / 10) * (svgW - 2 * pad);
  const toSvgY = (y: number) => svgH - pad - (y / 10) * (svgH - 2 * pad);

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <h1 className="text-2xl font-bold font-display mb-1 text-foreground">K-Means Clustering</h1>
        <p className="text-muted-foreground text-sm mb-6">Watch clusters form through iterative centroid updates.</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-card border border-border rounded-xl p-4">
            <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full h-auto">
              <rect width={svgW} height={svgH} fill="none" />
              {data.map((p, i) => (
                <circle key={i} cx={toSvgX(p.x)} cy={toSvgY(p.y)} r={4}
                  fill={assignments.length > 0 ? COLORS[assignments[i] % COLORS.length] : 'hsl(220, 10%, 70%)'} opacity={0.7} />
              ))}
              {centroids.map((c, i) => (
                <g key={i}>
                  <circle cx={toSvgX(c.x)} cy={toSvgY(c.y)} r={10} fill={COLORS[i % COLORS.length]} stroke="hsl(0,0%,100%)" strokeWidth={3} />
                  <text x={toSvgX(c.x)} y={toSvgY(c.y) + 4} textAnchor="middle" className="text-[10px] font-bold" fill="white">C</text>
                </g>
              ))}
            </svg>
          </div>

          <div className="space-y-6">
            <div className="bg-card border border-border rounded-xl p-5 shadow-card">
              <label className="text-sm font-medium text-foreground">K: {k}</label>
              <Slider value={[k]} onValueChange={v => { setK(v[0]); setCentroids([]); setAssignments([]); setIteration(0); }}
                min={2} max={5} step={1} className="mt-2 mb-4" />
              <div className="bg-muted rounded-lg p-4 text-center mb-4">
                <p className="text-xs text-muted-foreground mb-1">Iteration</p>
                <p className="text-2xl font-bold font-display text-foreground">{iteration}</p>
              </div>
              <div className="flex gap-2">
                <Button onClick={initCentroids} variant="outline" className="flex-1" size="sm">Random Init</Button>
                <Button onClick={startAnimation} className="flex-1 gradient-accent text-accent-foreground" size="sm" disabled={running}>
                  {running ? 'Running...' : 'Animate'}
                </Button>
              </div>
              <Button onClick={step} variant="outline" className="w-full mt-2" size="sm" disabled={centroids.length === 0}>
                Step
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}