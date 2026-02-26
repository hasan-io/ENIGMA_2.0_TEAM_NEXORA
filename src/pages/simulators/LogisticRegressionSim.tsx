import { useState, useMemo } from 'react';
import { SimulatorLayout } from '@/components/simulator/SimulatorLayout';
import { Slider } from '@/components/ui/slider';

function generateData(n = 40) {
  const pts: { x: number; y: number; label: number }[] = [];
  for (let i = 0; i < n; i++) {
    const x = Math.random() * 10 - 5;
    const y = Math.random() * 10 - 5;
    const label = (2 * x + y - 1 > 0) ? 1 : 0;
    // Add some noise
    const noisyLabel = Math.random() < 0.1 ? 1 - label : label;
    pts.push({ x: +x.toFixed(2), y: +y.toFixed(2), label: noisyLabel });
  }
  return pts;
}

function sigmoid(z: number) {
  return 1 / (1 + Math.exp(-z));
}

export default function LogisticRegressionSim() {
  const [data] = useState(generateData);
  const [w1, setW1] = useState(1);
  const [w2, setW2] = useState(0.5);
  const [bias, setBias] = useState(0);

  const accuracy = useMemo(() => {
    let correct = 0;
    data.forEach(p => {
      const prob = sigmoid(w1 * p.x + w2 * p.y + bias);
      const pred = prob > 0.5 ? 1 : 0;
      if (pred === p.label) correct++;
    });
    return ((correct / data.length) * 100).toFixed(1);
  }, [data, w1, w2, bias]);

  // Decision boundary: w1*x + w2*y + b = 0 => y = -(w1*x + b) / w2
  const boundaryPoints = useMemo(() => {
    if (Math.abs(w2) < 0.01) return null;
    const x1 = -5, x2 = 5;
    const y1 = -(w1 * x1 + bias) / w2;
    const y2 = -(w1 * x2 + bias) / w2;
    return { x1, y1, x2, y2 };
  }, [w1, w2, bias]);

  const svgW = 500, svgH = 400;
  const pad = 40;
  const toSvgX = (x: number) => pad + ((x + 5) / 10) * (svgW - 2 * pad);
  const toSvgY = (y: number) => svgH - pad - ((y + 5) / 10) * (svgH - 2 * pad);

  return (
    <SimulatorLayout topicId="logistic-regression" topicName="Logistic Regression">
      <h1 className="text-2xl font-bold font-display mb-1 text-foreground">Logistic Regression</h1>
      <p className="text-muted-foreground text-sm mb-6">Adjust weights and bias to move the decision boundary.</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-card border border-border rounded-xl p-4">
            <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full h-auto">
              <rect width={svgW} height={svgH} fill="none" />
              {/* Grid */}
              {Array.from({ length: 11 }, (_, i) => i - 5).map(v => (
                <g key={v}>
                  <line x1={toSvgX(v)} y1={pad} x2={toSvgX(v)} y2={svgH - pad} stroke="hsl(220,15%,90%)" strokeWidth={0.5} />
                  <line x1={pad} y1={toSvgY(v)} x2={svgW - pad} y2={toSvgY(v)} stroke="hsl(220,15%,90%)" strokeWidth={0.5} />
                  <text x={toSvgX(v)} y={svgH - pad + 16} textAnchor="middle" className="text-[10px] fill-muted-foreground">{v}</text>
                  <text x={pad - 8} y={toSvgY(v) + 4} textAnchor="end" className="text-[10px] fill-muted-foreground">{v}</text>
                </g>
              ))}
              {/* Decision boundary */}
              {boundaryPoints && (
                <line
                  x1={toSvgX(boundaryPoints.x1)} y1={toSvgY(boundaryPoints.y1)}
                  x2={toSvgX(boundaryPoints.x2)} y2={toSvgY(boundaryPoints.y2)}
                  stroke="hsl(175, 75%, 38%)" strokeWidth={3} strokeDasharray="6 4"
                />
              )}
              {/* Data points */}
              {data.map((p, i) => (
                <circle
                  key={i}
                  cx={toSvgX(p.x)}
                  cy={toSvgY(p.y)}
                  r={5}
                  fill={p.label === 1 ? 'hsl(230, 75%, 55%)' : 'hsl(0, 84%, 60%)'}
                  opacity={0.8}
                />
              ))}
            </svg>
          </div>

          <div className="space-y-6">
            <div className="bg-card border border-border rounded-xl p-5 shadow-card">
              <div className="mb-4">
                <label className="text-sm font-medium text-foreground">Weight 1 (w₁): {w1.toFixed(1)}</label>
                <Slider value={[w1]} onValueChange={v => setW1(v[0])} min={-5} max={5} step={0.1} className="mt-2" />
              </div>
              <div className="mb-4">
                <label className="text-sm font-medium text-foreground">Weight 2 (w₂): {w2.toFixed(1)}</label>
                <Slider value={[w2]} onValueChange={v => setW2(v[0])} min={-5} max={5} step={0.1} className="mt-2" />
              </div>
              <div className="mb-4">
                <label className="text-sm font-medium text-foreground">Bias (b): {bias.toFixed(1)}</label>
                <Slider value={[bias]} onValueChange={v => setBias(v[0])} min={-10} max={10} step={0.1} className="mt-2" />
              </div>
              <div className="bg-muted rounded-lg p-4 text-center">
                <p className="text-xs text-muted-foreground mb-1">Accuracy</p>
                <p className="text-2xl font-bold font-display text-foreground">{accuracy}%</p>
              </div>
            </div>
            <div className="bg-card border border-border rounded-xl p-5 shadow-card text-sm text-muted-foreground">
              <p className="font-medium text-foreground mb-2">Formulas</p>
              <p>σ(z) = 1 / (1 + e⁻ᶻ)</p>
              <p>z = w₁x + w₂y + b</p>
              <p>Boundary: z = 0</p>
            </div>
          </div>
      </div>
    </SimulatorLayout>
  );
}
