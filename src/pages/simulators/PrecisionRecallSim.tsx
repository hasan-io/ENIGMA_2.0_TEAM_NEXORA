import { useState, useMemo } from 'react';
import { SimulatorLayout } from '@/components/simulator/SimulatorLayout';
import { Slider } from '@/components/ui/slider';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function generatePRData(separation: number) {
  const points: { recall: number; precision: number }[] = [];
  for (let t = 0; t <= 1; t += 0.02) {
    const recall = t;
    const precision = Math.max(0.1, 1 - Math.pow(recall, separation));
    points.push({ recall: +recall.toFixed(3), precision: +precision.toFixed(3) });
  }
  return points;
}

export default function PrecisionRecallSim() {
  const [separation, setSeparation] = useState(1.5);
  const [threshold, setThreshold] = useState(0.5);

  const prData = useMemo(() => generatePRData(separation), [separation]);

  const currentPoint = useMemo(() => {
    const idx = Math.min(Math.floor(threshold * prData.length), prData.length - 1);
    return prData[idx];
  }, [threshold, prData]);

  const prAuc = useMemo(() => {
    let area = 0;
    for (let i = 1; i < prData.length; i++) {
      const dx = prData[i].recall - prData[i - 1].recall;
      const avgY = (prData[i].precision + prData[i - 1].precision) / 2;
      area += dx * avgY;
    }
    return area.toFixed(3);
  }, [prData]);

  return (
    <SimulatorLayout topicId="precision-recall" topicName="Precision-Recall Curve">
      <h1 className="text-2xl font-bold font-display mb-1 text-foreground">Precision-Recall Curve</h1>
      <p className="text-muted-foreground text-sm mb-6">Move the threshold to see precision and recall tradeoff.</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card border border-border rounded-xl p-4">
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={prData} margin={{ top: 10, right: 10, bottom: 30, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="recall" type="number" domain={[0, 1]} label={{ value: 'Recall', position: 'bottom', offset: 10 }} />
              <YAxis dataKey="precision" type="number" domain={[0, 1]} label={{ value: 'Precision', angle: -90, position: 'insideLeft' }} />
              <Tooltip formatter={(v: number) => v.toFixed(3)} />
              <Line dataKey="precision" stroke="hsl(230, 75%, 55%)" strokeWidth={3} dot={false} type="monotone" />
              {/* Current threshold point */}
              <Line data={[currentPoint]} dataKey="precision" stroke="none" dot={{ r: 8, fill: 'hsl(175, 75%, 38%)', stroke: 'white', strokeWidth: 2 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-6">
          <div className="bg-card border border-border rounded-xl p-5 shadow-card">
            <div className="mb-4">
              <label className="text-sm font-medium text-foreground">Threshold: {threshold.toFixed(2)}</label>
              <Slider value={[threshold]} onValueChange={v => setThreshold(v[0])} min={0} max={0.99} step={0.01} className="mt-2" />
            </div>
            <div className="mb-4">
              <label className="text-sm font-medium text-foreground">Model Quality: {separation.toFixed(1)}</label>
              <Slider value={[separation]} onValueChange={v => setSeparation(v[0])} min={0.3} max={5} step={0.1} className="mt-2" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-muted rounded-lg p-3 text-center">
                <p className="text-xs text-muted-foreground mb-1">Precision</p>
                <p className="text-lg font-bold font-display text-foreground">{(currentPoint?.precision * 100 || 0).toFixed(0)}%</p>
              </div>
              <div className="bg-muted rounded-lg p-3 text-center">
                <p className="text-xs text-muted-foreground mb-1">Recall</p>
                <p className="text-lg font-bold font-display text-foreground">{(currentPoint?.recall * 100 || 0).toFixed(0)}%</p>
              </div>
            </div>
            <div className="bg-muted rounded-lg p-3 text-center mt-3">
              <p className="text-xs text-muted-foreground mb-1">PR-AUC</p>
              <p className="text-xl font-bold font-display text-foreground">{prAuc}</p>
            </div>
          </div>
        </div>
      </div>
    </SimulatorLayout>
  );
}
