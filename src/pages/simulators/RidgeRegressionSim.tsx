import { useState, useMemo } from 'react';
import { SimulatorLayout } from '@/components/simulator/SimulatorLayout';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function generateData(n = 30, nFeatures = 5) {
  const X: number[][] = [];
  const y: number[] = [];
  const trueWeights = [3, -1.5, 0.2, 0.8, -0.1];
  for (let i = 0; i < n; i++) {
    const row = Array.from({ length: nFeatures }, () => (Math.random() - 0.5) * 4);
    X.push(row);
    y.push(trueWeights.reduce((s, w, j) => s + w * row[j], 0) + (Math.random() - 0.5) * 2);
  }
  return { X, y };
}

function ridgeFit(X: number[][], y: number[], lambda: number) {
  const n = X.length, p = X[0].length;
  // (XᵀX + λI)⁻¹ Xᵀy via simple iterative approach
  const XtX: number[][] = Array.from({ length: p }, (_, i) =>
    Array.from({ length: p }, (_, j) =>
      X.reduce((s, row) => s + row[i] * row[j], 0) + (i === j ? lambda : 0)
    )
  );
  const XtY: number[] = Array.from({ length: p }, (_, i) =>
    X.reduce((s, row, idx) => s + row[i] * y[idx], 0)
  );
  // Gaussian elimination
  const aug = XtX.map((row, i) => [...row, XtY[i]]);
  const m = aug.length;
  for (let col = 0; col < m; col++) {
    let maxRow = col;
    for (let row = col + 1; row < m; row++) {
      if (Math.abs(aug[row][col]) > Math.abs(aug[maxRow][col])) maxRow = row;
    }
    [aug[col], aug[maxRow]] = [aug[maxRow], aug[col]];
    if (Math.abs(aug[col][col]) < 1e-10) continue;
    for (let row = 0; row < m; row++) {
      if (row === col) continue;
      const f = aug[row][col] / aug[col][col];
      for (let j = col; j <= m; j++) aug[row][j] -= f * aug[col][j];
    }
  }
  return aug.map((row, i) => row[m] / row[i]);
}

function lassoFit(X: number[][], y: number[], lambda: number) {
  const n = X.length, p = X[0].length;
  const w = new Array(p).fill(0);
  for (let iter = 0; iter < 100; iter++) {
    for (let j = 0; j < p; j++) {
      let num = 0, den = 0;
      for (let i = 0; i < n; i++) {
        const pred = X[i].reduce((s, x, k) => s + (k === j ? 0 : x * w[k]), 0);
        num += X[i][j] * (y[i] - pred);
        den += X[i][j] ** 2;
      }
      if (den === 0) { w[j] = 0; continue; }
      const raw = num / den;
      const t = lambda / (2 * den);
      w[j] = raw > t ? raw - t : raw < -t ? raw + t : 0;
    }
  }
  return w;
}

export default function RidgeRegressionSim() {
  const [{ X, y }] = useState(() => generateData());
  const [lambda, setLambda] = useState(1);
  const [showCompare, setShowCompare] = useState(false);

  const ridgeWeights = useMemo(() => ridgeFit(X, y, lambda), [X, y, lambda]);
  const lassoWeights = useMemo(() => lassoFit(X, y, lambda), [X, y, lambda]);

  const chartData = ridgeWeights.map((w, i) => ({
    feature: `w${i + 1}`,
    ridge: +w.toFixed(3),
    lasso: +lassoWeights[i].toFixed(3),
  }));

  const ridgeMse = useMemo(() => {
    const n = X.length;
    return X.reduce((s, row, i) => s + (y[i] - row.reduce((ss, x, j) => ss + x * ridgeWeights[j], 0)) ** 2, 0) / n;
  }, [X, y, ridgeWeights]);

  return (
    <SimulatorLayout topicId="ridge-regression" topicName="Ridge Regression">
      <h1 className="text-2xl font-bold font-display mb-1 text-foreground">Ridge Regression (L2)</h1>
      <p className="text-muted-foreground text-sm mb-6">Ridge shrinks coefficients but never zeros them. Compare with Lasso.</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card border border-border rounded-xl p-4">
          <h3 className="text-sm font-medium text-foreground mb-3">
            {showCompare ? 'Ridge vs Lasso Comparison' : 'Ridge Coefficients'}
          </h3>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="feature" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="ridge" fill="hsl(230, 75%, 55%)" radius={[4, 4, 0, 0]} name="Ridge (L2)" />
              {showCompare && <Bar dataKey="lasso" fill="hsl(175, 75%, 38%)" radius={[4, 4, 0, 0]} name="Lasso (L1)" />}
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-6">
          <div className="bg-card border border-border rounded-xl p-5 shadow-card">
            <label className="text-sm font-medium text-foreground">λ: {lambda.toFixed(1)}</label>
            <Slider value={[lambda]} onValueChange={v => setLambda(v[0])} min={0} max={20} step={0.1} className="mt-2 mb-4" />
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-foreground">Compare with Lasso</span>
              <Switch checked={showCompare} onCheckedChange={setShowCompare} />
            </div>
            <div className="bg-muted rounded-lg p-3 text-center">
              <p className="text-xs text-muted-foreground mb-1">Ridge MSE</p>
              <p className="text-lg font-bold font-display text-foreground">{ridgeMse.toFixed(2)}</p>
            </div>
          </div>
          <div className="bg-card border border-border rounded-xl p-5 shadow-card text-sm text-muted-foreground">
            <p className="font-medium text-foreground mb-2">Key Difference</p>
            <p><strong className="text-foreground">Ridge (L2)</strong>: Shrinks all weights, never zeros</p>
            <p><strong className="text-foreground">Lasso (L1)</strong>: Can zero out weights entirely</p>
            <p className="mt-2">Formula: L = MSE + λ · Σwᵢ²</p>
          </div>
        </div>
      </div>
    </SimulatorLayout>
  );
}
