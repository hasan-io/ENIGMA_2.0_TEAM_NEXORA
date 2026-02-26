import { useState, useMemo } from 'react';
import { SimulatorLayout } from '@/components/simulator/SimulatorLayout';
import { Slider } from '@/components/ui/slider';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

function generateLearningCurves(complexity: number, noise: number) {
  const points: { complexity: number; training: number; validation: number }[] = [];
  for (let c = 1; c <= 10; c++) {
    // Training error decreases with complexity
    const trainError = Math.max(0.05, 1 / (1 + c * 0.5) + noise * 0.1 * Math.random());
    // Validation error has U-shape
    const optimalC = complexity;
    const valError = Math.max(0.1, 0.1 + 0.3 * Math.pow((c - optimalC) / 3, 2) + noise * 0.15 * Math.random());
    points.push({
      complexity: c,
      training: +trainError.toFixed(3),
      validation: +valError.toFixed(3),
    });
  }
  return points;
}

export default function LearningCurvesSim() {
  const [optimalComplexity, setOptimalComplexity] = useState(5);
  const [noise, setNoise] = useState(0.5);

  const curveData = useMemo(() => generateLearningCurves(optimalComplexity, noise), [optimalComplexity, noise]);

  const bestComplexity = useMemo(() => {
    let minVal = Infinity, bestC = 1;
    curveData.forEach(p => {
      if (p.validation < minVal) { minVal = p.validation; bestC = p.complexity; }
    });
    return bestC;
  }, [curveData]);

  return (
    <SimulatorLayout topicId="learning-curves" topicName="Learning Curves">
      <h1 className="text-2xl font-bold font-display mb-1 text-foreground">Learning Curves</h1>
      <p className="text-muted-foreground text-sm mb-6">See how training and validation errors change with model complexity.</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card border border-border rounded-xl p-4">
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={curveData} margin={{ top: 10, right: 10, bottom: 30, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="complexity" label={{ value: 'Model Complexity', position: 'bottom', offset: 10 }} />
              <YAxis label={{ value: 'Error', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              <Line dataKey="training" stroke="hsl(230, 75%, 55%)" strokeWidth={3} dot={{ r: 4 }} name="Training Error" />
              <Line dataKey="validation" stroke="hsl(0, 84%, 60%)" strokeWidth={3} dot={{ r: 4 }} name="Validation Error" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-6">
          <div className="bg-card border border-border rounded-xl p-5 shadow-card">
            <div className="mb-4">
              <label className="text-sm font-medium text-foreground">Optimal Complexity: {optimalComplexity}</label>
              <Slider value={[optimalComplexity]} onValueChange={v => setOptimalComplexity(v[0])} min={2} max={9} step={1} className="mt-2" />
            </div>
            <div className="mb-4">
              <label className="text-sm font-medium text-foreground">Noise Level: {noise.toFixed(1)}</label>
              <Slider value={[noise]} onValueChange={v => setNoise(v[0])} min={0} max={2} step={0.1} className="mt-2" />
            </div>
            <div className="bg-muted rounded-lg p-3 text-center">
              <p className="text-xs text-muted-foreground mb-1">Best Complexity</p>
              <p className="text-2xl font-bold font-display text-foreground">{bestComplexity}</p>
            </div>
          </div>
          <div className="bg-card border border-border rounded-xl p-5 shadow-card text-sm text-muted-foreground">
            <p className="font-medium text-foreground mb-2">Interpretation</p>
            <p>Left of optimal → <strong className="text-foreground">Underfitting</strong></p>
            <p>Right of optimal → <strong className="text-foreground">Overfitting</strong></p>
            <p className="mt-2">Gap between curves = variance</p>
          </div>
        </div>
      </div>
    </SimulatorLayout>
  );
}
