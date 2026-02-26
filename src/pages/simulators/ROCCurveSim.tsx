import { useState, useMemo } from 'react';
<<<<<<< HEAD
import { SimulatorLayout } from '@/components/simulator/SimulatorLayout';
=======
import { AppLayout } from '@/components/layout/AppLayout';
>>>>>>> 2e31993a8f50f3c24a0ea934fdf5039eb59ed03f
import { Slider } from '@/components/ui/slider';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

function generateROCData(separation: number) {
  const points: { fpr: number; tpr: number }[] = [{ fpr: 0, tpr: 0 }];
  for (let t = 0; t <= 1; t += 0.02) {
    // Model with adjustable separation
    const tpr = Math.min(1, Math.pow(t, 1 / (separation + 0.1)));
    const fpr = t;
    points.push({ fpr: +fpr.toFixed(3), tpr: +tpr.toFixed(3) });
  }
  points.push({ fpr: 1, tpr: 1 });
  return points;
}

export default function ROCCurveSim() {
  const [separation, setSeparation] = useState(3);

  const rocData = useMemo(() => generateROCData(separation), [separation]);

  const auc = useMemo(() => {
    let area = 0;
    for (let i = 1; i < rocData.length; i++) {
      const dx = rocData[i].fpr - rocData[i - 1].fpr;
      const avgY = (rocData[i].tpr + rocData[i - 1].tpr) / 2;
      area += dx * avgY;
    }
    return area.toFixed(3);
  }, [rocData]);

  const diagonalData = [{ fpr: 0, tpr: 0 }, { fpr: 1, tpr: 1 }];

  return (
<<<<<<< HEAD
    <SimulatorLayout topicId="roc-curve" topicName="ROC Curve">
      <h1 className="text-2xl font-bold font-display mb-1 text-foreground">ROC Curve</h1>
      <p className="text-muted-foreground text-sm mb-6">Adjust class separation to see how ROC curve and AUC change.</p>
=======
    <AppLayout>
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <h1 className="text-2xl font-bold font-display mb-1 text-foreground">ROC Curve</h1>
        <p className="text-muted-foreground text-sm mb-6">Adjust class separation to see how ROC curve and AUC change.</p>
>>>>>>> 2e31993a8f50f3c24a0ea934fdf5039eb59ed03f

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-card border border-border rounded-xl p-4">
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart margin={{ top: 10, right: 10, bottom: 30, left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="fpr" type="number" domain={[0, 1]} label={{ value: 'False Positive Rate', position: 'bottom', offset: 10 }} />
                <YAxis dataKey="tpr" type="number" domain={[0, 1]} label={{ value: 'True Positive Rate', angle: -90, position: 'insideLeft' }} />
                <Tooltip formatter={(v: number) => v.toFixed(3)} />
                <Area data={rocData} dataKey="tpr" stroke="hsl(230, 75%, 55%)" fill="hsl(230, 75%, 55%)" fillOpacity={0.15} strokeWidth={3} type="monotone" />
                <Line data={diagonalData} dataKey="tpr" stroke="hsl(220, 10%, 70%)" strokeDasharray="5 5" strokeWidth={1.5} dot={false} type="linear" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-6">
            <div className="bg-card border border-border rounded-xl p-5 shadow-card">
              <label className="text-sm font-medium text-foreground">Class Separation: {separation.toFixed(1)}</label>
              <Slider value={[separation]} onValueChange={v => setSeparation(v[0])} min={0.5} max={8} step={0.1} className="mt-2 mb-4" />
              <div className="bg-muted rounded-lg p-4 text-center">
                <p className="text-xs text-muted-foreground mb-1">AUC</p>
                <p className="text-3xl font-bold font-display text-foreground">{auc}</p>
              </div>
            </div>
            <div className="bg-card border border-border rounded-xl p-5 shadow-card text-sm text-muted-foreground">
              <p className="font-medium text-foreground mb-2">Interpretation</p>
              <p>AUC = 1.0 → Perfect</p>
              <p>AUC = 0.5 → Random</p>
              <p>AUC &lt; 0.5 → Worse than random</p>
              <p className="mt-2">Dashed line = random classifier</p>
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
