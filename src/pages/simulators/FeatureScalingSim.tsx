import { useState, useMemo } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Switch } from '@/components/ui/switch';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const rawData = [
  { feature: 'Age', value: 25 },
  { feature: 'Salary', value: 50000 },
  { feature: 'Experience', value: 3 },
  { feature: 'Score', value: 85 },
  { feature: 'Distance', value: 120 },
  { feature: 'Rating', value: 4.5 },
];

export default function FeatureScalingSim() {
  const [useStandardization, setUseStandardization] = useState(false);

  const scaled = useMemo(() => {
    const values = rawData.map(d => d.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const mean = values.reduce((s, v) => s + v, 0) / values.length;
    const std = Math.sqrt(values.reduce((s, v) => s + (v - mean) ** 2, 0) / values.length);

    return rawData.map(d => ({
      feature: d.feature,
      original: d.value,
      scaled: useStandardization
        ? +((d.value - mean) / std).toFixed(3)
        : +((d.value - min) / (max - min)).toFixed(3),
    }));
  }, [useStandardization]);

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <h1 className="text-2xl font-bold font-display mb-1 text-foreground">Feature Scaling</h1>
        <p className="text-muted-foreground text-sm mb-6">Toggle between normalization and standardization.</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-card border border-border rounded-xl p-4">
              <h3 className="text-sm font-medium text-foreground mb-3">Original Values</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={rawData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="feature" className="text-xs" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="hsl(230, 75%, 55%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-card border border-border rounded-xl p-4">
              <h3 className="text-sm font-medium text-foreground mb-3">
                {useStandardization ? 'Standardized' : 'Normalized'} Values
              </h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={scaled}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="feature" className="text-xs" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="scaled" fill="hsl(175, 75%, 38%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-card border border-border rounded-xl p-5 shadow-card">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-foreground">
                  {useStandardization ? 'Standardization' : 'Normalization'}
                </span>
                <Switch checked={useStandardization} onCheckedChange={setUseStandardization} />
              </div>
              <div className="bg-muted rounded-lg p-4 text-sm text-muted-foreground">
                {useStandardization ? (
                  <>
                    <p className="font-medium text-foreground mb-1">Standardization</p>
                    <p>x' = (x - μ) / σ</p>
                    <p className="mt-2">Result: mean ≈ 0, std ≈ 1</p>
                  </>
                ) : (
                  <>
                    <p className="font-medium text-foreground mb-1">Normalization</p>
                    <p>x' = (x - min) / (max - min)</p>
                    <p className="mt-2">Result: range [0, 1]</p>
                  </>
                )}
              </div>
            </div>
            <div className="bg-card border border-border rounded-xl p-5 shadow-card">
              <p className="font-medium text-foreground text-sm mb-2">Data Table</p>
              <div className="text-xs space-y-1">
                {scaled.map(d => (
                  <div key={d.feature} className="flex justify-between text-muted-foreground">
                    <span>{d.feature}: {d.original}</span>
                    <span className="text-foreground font-medium">→ {d.scaled}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
