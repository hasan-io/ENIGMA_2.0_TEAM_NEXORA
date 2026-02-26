import { useState, useCallback, useRef, useEffect } from 'react';
import { SimulatorLayout } from '@/components/simulator/SimulatorLayout';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';

export default function GradientDescentSim() {
  const [lr, setLr] = useState(0.1);
  const [w, setW] = useState(4);
  const [history, setHistory] = useState<{ w: number; f: number }[]>([]);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const f = (w: number) => w * w;
  const df = (w: number) => 2 * w;

  const step = useCallback(() => {
    setW(prev => {
      const grad = df(prev);
      const next = prev - lr * grad;
      setHistory(h => [...h, { w: prev, f: f(prev) }]);
      return +next.toFixed(4);
    });
  }, [lr]);

  const start = useCallback(() => {
    setHistory([]);
    setRunning(true);
  }, []);

  const reset = useCallback(() => {
    setW(4);
    setHistory([]);
    setRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, []);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        step();
      }, 300);
      const timeout = setTimeout(() => {
        setRunning(false);
        if (intervalRef.current) clearInterval(intervalRef.current);
      }, 6000);
      return () => { clearTimeout(timeout); if (intervalRef.current) clearInterval(intervalRef.current); };
    }
  }, [running, step]);

  const svgW = 500, svgH = 400, pad = 50;
  const wRange = [-5, 5];
  const fMax = 25;
  const toSvgX = (wv: number) => pad + ((wv - wRange[0]) / (wRange[1] - wRange[0])) * (svgW - 2 * pad);
  const toSvgY = (fv: number) => svgH - pad - (fv / fMax) * (svgH - 2 * pad);

  // Parabola path
  const pathPts: string[] = [];
  for (let wv = wRange[0]; wv <= wRange[1]; wv += 0.1) {
    const x = toSvgX(wv);
    const y = toSvgY(f(wv));
    pathPts.push(`${pathPts.length === 0 ? 'M' : 'L'}${x},${y}`);
  }

  return (
    <SimulatorLayout topicId="gradient-descent" topicName="Gradient Descent">
      <h1 className="text-2xl font-bold font-display mb-1 text-foreground">Gradient Descent</h1>
      <p className="text-muted-foreground text-sm mb-6">Watch the dot descend f(w) = w² toward the minimum.</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-card border border-border rounded-xl p-4">
            <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full h-auto">
              <rect width={svgW} height={svgH} fill="none" />
              {/* Axes */}
              <line x1={pad} y1={svgH - pad} x2={svgW - pad} y2={svgH - pad} stroke="hsl(220,10%,70%)" />
              <line x1={pad} y1={pad} x2={pad} y2={svgH - pad} stroke="hsl(220,10%,70%)" />
              <text x={svgW / 2} y={svgH - 10} textAnchor="middle" className="text-[12px] fill-muted-foreground">w</text>
              <text x={15} y={svgH / 2} textAnchor="middle" className="text-[12px] fill-muted-foreground" transform={`rotate(-90 15 ${svgH / 2})`}>f(w)</text>
              {/* Curve */}
              <path d={pathPts.join(' ')} fill="none" stroke="hsl(230, 75%, 55%)" strokeWidth={2.5} />
              {/* History trail */}
              {history.map((h, i) => (
                <circle key={i} cx={toSvgX(h.w)} cy={toSvgY(h.f)} r={3} fill="hsl(230, 75%, 55%)" opacity={0.3} />
              ))}
              {/* Current position */}
              <circle cx={toSvgX(w)} cy={toSvgY(f(w))} r={8} fill="hsl(175, 75%, 38%)" stroke="white" strokeWidth={2} />
            </svg>
          </div>

          <div className="space-y-6">
            <div className="bg-card border border-border rounded-xl p-5 shadow-card">
              <div className="mb-4">
                <label className="text-sm font-medium text-foreground">Learning Rate: {lr}</label>
                <Slider value={[lr]} onValueChange={v => setLr(v[0])} min={0.01} max={0.95} step={0.01} className="mt-2" />
              </div>
              <div className="mb-4">
                <label className="text-sm font-medium text-foreground">Starting w: {w.toFixed(2)}</label>
                <Slider value={[w]} onValueChange={v => { setW(v[0]); setHistory([]); }} min={-4.5} max={4.5} step={0.1} className="mt-2" />
              </div>
              <div className="bg-muted rounded-lg p-4 text-center mb-4">
                <p className="text-xs text-muted-foreground mb-1">Current f(w)</p>
                <p className="text-2xl font-bold font-display text-foreground">{f(w).toFixed(3)}</p>
              </div>
              <div className="flex gap-2">
                <Button onClick={start} className="flex-1 gradient-accent text-accent-foreground" size="sm" disabled={running}>
                  {running ? 'Running...' : 'Animate'}
                </Button>
                <Button onClick={reset} variant="outline" className="flex-1" size="sm">Reset</Button>
              </div>
              <Button onClick={step} variant="outline" className="w-full mt-2" size="sm">Step</Button>
            </div>
          </div>
      </div>
    </SimulatorLayout>
  );
}
