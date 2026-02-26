import { useState, useMemo } from 'react';
import { SimulatorLayout } from '@/components/simulator/SimulatorLayout';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function generateData(n = 30, nFeatures = 5) {
  const X: number[][] = [];
  const y: number[] = [];
  const trueWeights = [3, -1.5, 0, 0.8, 0]; // some are zero
  for (let i = 0; i < n; i++) {
    const row = Array.from({ length: nFeatures }, () => (Math.random() - 0.5) * 4);
    X.push(row);
    y.push(trueWeights.reduce((s, w, j) => s + w * row[j], 0) + (Math.random() - 0.5) * 2);
  }
  return { X, y, trueWeights };
}

function lassoFit(X: number[][], y: number[], lambda: number, iterations = 100) {
  const n = X.length;
  const p = X[0].length;
  const w = new Array(p).fill(0);

  for (let iter = 0; iter < iterations; iter++) {
    for (let j = 0; j < p; j++) {
      let numerator = 0;
      let denominator = 0;
      for (let i = 0; i < n; i++) {
        const pred = X[i].reduce((s, x, k) => s + (k === j ? 0 : x * w[k]), 0);
        const residual = y[i] - pred;
        numerator += X[i][j] * residual;
        denominator += X[i][j] ** 2;
      }
      if (denominator === 0) { w[j] = 0; continue; }
      const raw = numerator / denominator;
      // Soft thresholding
      if (raw > lambda / (2 * denominator)) w[j] = raw - lambda / (2 * denominator);
      else if (raw < -lambda / (2 * denominator)) w[j] = raw + lambda / (2 * denominator);
      else w[j] = 0;
    }
  }
  return w;
}

export default function LassoRegressionSim() {
  const [{ X, y }] = useState(() => generateData());
  const [lambda, setLambda] = useState(1);

  const weights = useMemo(() => lassoFit(X, y, lambda), [X, y, lambda]);

  const mse = useMemo(() => {
    const n = X.length;
    let sum = 0;
    for (let i = 0; i < n; i++) {
      const pred = X[i].reduce((s, x, j) => s + x * weights[j], 0);
      sum += (y[i] - pred) ** 2;
    }
    return sum / n;
  }, [X, y, weights]);

  const totalLoss = mse + lambda * weights.reduce((s, w) => s + Math.abs(w), 0);

  const chartData = weights.map((w, i) => ({
    feature: `w${i + 1}`,
    weight: +w.toFixed(3),
  }));

  return (
    <SimulatorLayout topicId="lasso-regression" topicName="Lasso Regression">
      <h1 className="text-2xl font-bold font-display mb-1 text-foreground">Lasso Regression (L1)</h1>
      <p className="text-muted-foreground text-sm mb-6">Increase λ to see coefficients shrink to zero — automatic feature selection.</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card border border-border rounded-xl p-4">
          <h3 className="text-sm font-medium text-foreground mb-3">Coefficient Values</h3>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="feature" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="weight" fill="hsl(230, 75%, 55%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-6">
          <div className="bg-card border border-border rounded-xl p-5 shadow-card">
            <label className="text-sm font-medium text-foreground">λ (Regularization): {lambda.toFixed(1)}</label>
            <Slider value={[lambda]} onValueChange={v => setLambda(v[0])} min={0} max={20} step={0.1} className="mt-2 mb-4" />
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-muted rounded-lg p-3 text-center">
                <p className="text-xs text-muted-foreground mb-1">MSE</p>
                <p className="text-lg font-bold font-display text-foreground">{mse.toFixed(2)}</p>
              </div>
              <div className="bg-muted rounded-lg p-3 text-center">
                <p className="text-xs text-muted-foreground mb-1">Total Loss</p>
                <p className="text-lg font-bold font-display text-foreground">{totalLoss.toFixed(2)}</p>
              </div>
            </div>
            <div className="mt-3 text-xs text-muted-foreground">
              <p>Non-zero coefficients: {weights.filter(w => Math.abs(w) > 0.001).length} / {weights.length}</p>
            </div>
          </div>
          <div className="bg-card border border-border rounded-xl p-5 shadow-card text-sm text-muted-foreground">
            <p className="font-medium text-foreground mb-2">Formula</p>
            <p>L = MSE + λ · Σ|wᵢ|</p>
            <p className="mt-2">L1 penalty drives weights to exactly zero</p>
          </div>
        </div>
      </div>
    </SimulatorLayout>
  );
}
