import { useState, useMemo, useCallback } from 'react';
<<<<<<< HEAD
import { SimulatorLayout } from '@/components/simulator/SimulatorLayout';
=======
import { AppLayout } from '@/components/layout/AppLayout';
>>>>>>> 2e31993a8f50f3c24a0ea934fdf5039eb59ed03f
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line, ComposedChart } from 'recharts';

function generateData(n = 20) {
  const points: { x: number; y: number }[] = [];
  for (let i = 0; i < n; i++) {
    const x = Math.random() * 10;
    const y = 2.5 * x + 5 + (Math.random() - 0.5) * 8;
    points.push({ x: +x.toFixed(2), y: +y.toFixed(2) });
  }
  return points;
}

export default function LinearRegressionSim() {
  const [data] = useState(generateData);
  const [m, setM] = useState(1);
  const [b, setB] = useState(1);

  const mse = useMemo(() => {
    const sum = data.reduce((acc, p) => {
      const yHat = m * p.x + b;
      return acc + (p.y - yHat) ** 2;
    }, 0);
    return sum / data.length;
  }, [data, m, b]);

  const lineData = useMemo(() => {
    return [{ x: 0, y: b }, { x: 10, y: m * 10 + b }];
  }, [m, b]);

  const findOptimal = useCallback(() => {
    const n = data.length;
    const mx = data.reduce((s, p) => s + p.x, 0) / n;
    const my = data.reduce((s, p) => s + p.y, 0) / n;
    const cov = data.reduce((s, p) => s + (p.x - mx) * (p.y - my), 0) / n;
    const vx = data.reduce((s, p) => s + (p.x - mx) ** 2, 0) / n;
    const optM = cov / vx;
    const optB = my - optM * mx;
    setM(+optM.toFixed(2));
    setB(+optB.toFixed(2));
  }, [data]);

  return (
<<<<<<< HEAD
    <SimulatorLayout topicId="linear-regression" topicName="Linear Regression">
      <h1 className="text-2xl font-bold font-display mb-1 text-foreground">Linear Regression Simulator</h1>
      <p className="text-muted-foreground text-sm mb-6">Adjust slope & intercept to fit the line. MSE updates in real-time.</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card border border-border rounded-xl p-4">
          <ResponsiveContainer width="100%" height={400}>
            <ComposedChart margin={{ top: 10, right: 10, bottom: 10, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="x" type="number" domain={[0, 10]} />
              <YAxis domain={['auto', 'auto']} />
              <Tooltip />
              <Scatter data={data} fill="hsl(230, 75%, 55%)" r={5} />
              <Line data={lineData} dataKey="y" stroke="hsl(175, 75%, 38%)" strokeWidth={3} dot={false} type="linear" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-6">
          <div className="bg-card border border-border rounded-xl p-5 shadow-card">
            <div className="mb-4">
              <label className="text-sm font-medium text-foreground">Slope (m): {m}</label>
              <Slider value={[m]} onValueChange={v => setM(v[0])} min={-5} max={8} step={0.1} className="mt-2" />
            </div>
            <div className="mb-4">
              <label className="text-sm font-medium text-foreground">Intercept (b): {b}</label>
              <Slider value={[b]} onValueChange={v => setB(v[0])} min={-10} max={30} step={0.1} className="mt-2" />
            </div>
            <div className="bg-muted rounded-lg p-4 text-center mb-4">
              <p className="text-xs text-muted-foreground mb-1">Mean Squared Error</p>
              <p className="text-2xl font-bold font-display text-foreground">{mse.toFixed(2)}</p>
            </div>
            <Button onClick={findOptimal} className="w-full gradient-accent text-accent-foreground">
              Find Optimal Line
            </Button>
          </div>
          <div className="bg-card border border-border rounded-xl p-5 shadow-card text-sm text-muted-foreground">
            <p className="font-medium text-foreground mb-2">Formulas</p>
            <p>ŷ = m·x + b</p>
            <p>MSE = avg((y - ŷ)²)</p>
            <p className="mt-2">Optimal: m = cov(x,y) / var(x)</p>
          </div>
        </div>
      </div>
    </SimulatorLayout>
=======
    <AppLayout>
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <h1 className="text-2xl font-bold font-display mb-1 text-foreground">Linear Regression Simulator</h1>
        <p className="text-muted-foreground text-sm mb-6">Adjust slope & intercept to fit the line. MSE updates in real-time.</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-card border border-border rounded-xl p-4">
            <ResponsiveContainer width="100%" height={400}>
              <ComposedChart margin={{ top: 10, right: 10, bottom: 10, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="x" type="number" domain={[0, 10]} />
                <YAxis domain={['auto', 'auto']} />
                <Tooltip />
                <Scatter data={data} fill="hsl(230, 75%, 55%)" r={5} />
                <Line data={lineData} dataKey="y" stroke="hsl(175, 75%, 38%)" strokeWidth={3} dot={false} type="linear" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-6">
            <div className="bg-card border border-border rounded-xl p-5 shadow-card">
              <div className="mb-4">
                <label className="text-sm font-medium text-foreground">Slope (m): {m}</label>
                <Slider value={[m]} onValueChange={v => setM(v[0])} min={-5} max={8} step={0.1} className="mt-2" />
              </div>
              <div className="mb-4">
                <label className="text-sm font-medium text-foreground">Intercept (b): {b}</label>
                <Slider value={[b]} onValueChange={v => setB(v[0])} min={-10} max={30} step={0.1} className="mt-2" />
              </div>
              <div className="bg-muted rounded-lg p-4 text-center mb-4">
                <p className="text-xs text-muted-foreground mb-1">Mean Squared Error</p>
                <p className="text-2xl font-bold font-display text-foreground">{mse.toFixed(2)}</p>
              </div>
              <Button onClick={findOptimal} className="w-full gradient-accent text-accent-foreground">
                Find Optimal Line
              </Button>
            </div>
            <div className="bg-card border border-border rounded-xl p-5 shadow-card text-sm text-muted-foreground">
              <p className="font-medium text-foreground mb-2">Formulas</p>
              <p>ŷ = m·x + b</p>
              <p>MSE = avg((y - ŷ)²)</p>
              <p className="mt-2">Optimal: m = cov(x,y) / var(x)</p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
>>>>>>> 2e31993a8f50f3c24a0ea934fdf5039eb59ed03f
  );
}
