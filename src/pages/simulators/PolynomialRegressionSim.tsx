import { useState, useMemo } from 'react';
<<<<<<< HEAD
import { SimulatorLayout } from '@/components/simulator/SimulatorLayout';
=======
import { AppLayout } from '@/components/layout/AppLayout';
>>>>>>> 2e31993a8f50f3c24a0ea934fdf5039eb59ed03f
import { Slider } from '@/components/ui/slider';
import { ComposedChart, Scatter, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function generateData(n = 25) {
  const pts: { x: number; y: number }[] = [];
  for (let i = 0; i < n; i++) {
    const x = (Math.random() * 6) - 3;
    const y = 0.5 * x * x - x + 2 + (Math.random() - 0.5) * 3;
    pts.push({ x: +x.toFixed(2), y: +y.toFixed(2) });
  }
  return pts.sort((a, b) => a.x - b.x);
}

// Polynomial fit using normal equation (simple implementation)
function polyFit(data: { x: number; y: number }[], degree: number) {
  const n = data.length;
  const X: number[][] = data.map(p => {
    const row: number[] = [];
    for (let d = 0; d <= degree; d++) row.push(p.x ** d);
    return row;
  });
  const Y = data.map(p => p.y);
  
  // X^T * X
  const XtX: number[][] = Array.from({ length: degree + 1 }, (_, i) =>
    Array.from({ length: degree + 1 }, (_, j) =>
      X.reduce((s, row) => s + row[i] * row[j], 0)
    )
  );
  // X^T * Y
  const XtY: number[] = Array.from({ length: degree + 1 }, (_, i) =>
    X.reduce((s, row, idx) => s + row[i] * Y[idx], 0)
  );
  
  // Solve using Gaussian elimination
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
      const factor = aug[row][col] / aug[col][col];
      for (let j = col; j <= m; j++) aug[row][j] -= factor * aug[col][j];
    }
  }
  return aug.map((row, i) => row[m] / row[i]);
}

function evalPoly(coeffs: number[], x: number) {
  return coeffs.reduce((s, c, i) => s + c * x ** i, 0);
}

export default function PolynomialRegressionSim() {
  const [data] = useState(generateData);
  const [degree, setDegree] = useState(2);

  const coeffs = useMemo(() => polyFit(data, degree), [data, degree]);

  const curveData = useMemo(() => {
    const pts: { x: number; y: number }[] = [];
    for (let x = -3.5; x <= 3.5; x += 0.1) {
      pts.push({ x: +x.toFixed(2), y: +evalPoly(coeffs, x).toFixed(2) });
    }
    return pts;
  }, [coeffs]);

  const mse = useMemo(() => {
    const sum = data.reduce((s, p) => s + (p.y - evalPoly(coeffs, p.x)) ** 2, 0);
    return sum / data.length;
  }, [data, coeffs]);

  return (
<<<<<<< HEAD
    <SimulatorLayout topicId="polynomial-regression" topicName="Polynomial Regression">
      <h1 className="text-2xl font-bold font-display mb-1 text-foreground">Polynomial Regression</h1>
      <p className="text-muted-foreground text-sm mb-6">Change the degree to see how curve complexity affects fitting.</p>
=======
    <AppLayout>
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <h1 className="text-2xl font-bold font-display mb-1 text-foreground">Polynomial Regression</h1>
        <p className="text-muted-foreground text-sm mb-6">Change the degree to see how curve complexity affects fitting.</p>
>>>>>>> 2e31993a8f50f3c24a0ea934fdf5039eb59ed03f

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-card border border-border rounded-xl p-4">
            <ResponsiveContainer width="100%" height={400}>
              <ComposedChart margin={{ top: 10, right: 10, bottom: 10, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="x" type="number" domain={[-3.5, 3.5]} />
                <YAxis domain={['auto', 'auto']} />
                <Tooltip />
                <Scatter data={data} fill="hsl(230, 75%, 55%)" r={5} />
                <Line data={curveData} dataKey="y" stroke="hsl(175, 75%, 38%)" strokeWidth={3} dot={false} type="monotone" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-6">
            <div className="bg-card border border-border rounded-xl p-5 shadow-card">
              <label className="text-sm font-medium text-foreground">Degree: {degree}</label>
              <Slider value={[degree]} onValueChange={v => setDegree(v[0])} min={1} max={5} step={1} className="mt-2" />
              <div className="bg-muted rounded-lg p-4 text-center mt-4">
                <p className="text-xs text-muted-foreground mb-1">MSE</p>
                <p className="text-2xl font-bold font-display text-foreground">{mse.toFixed(3)}</p>
              </div>
            </div>
            <div className="bg-card border border-border rounded-xl p-5 shadow-card text-sm text-muted-foreground">
              <p className="font-medium text-foreground mb-2">Coefficients</p>
              {coeffs.map((c, i) => (
                <p key={i}>a{i} = {c.toFixed(3)}</p>
              ))}
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
