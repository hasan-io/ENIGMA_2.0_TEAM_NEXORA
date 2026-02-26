import { useState, useMemo } from 'react';
import { SimulatorLayout } from '@/components/simulator/SimulatorLayout';
import { Slider } from '@/components/ui/slider';

export default function ConfusionMatrixSim() {
  const [tp, setTp] = useState(45);
  const [fp, setFp] = useState(10);
  const [fn, setFn] = useState(5);
  const [tn, setTn] = useState(40);

  const metrics = useMemo(() => {
    const total = tp + fp + fn + tn;
    const accuracy = total > 0 ? ((tp + tn) / total * 100) : 0;
    const precision = (tp + fp) > 0 ? (tp / (tp + fp) * 100) : 0;
    const recall = (tp + fn) > 0 ? (tp / (tp + fn) * 100) : 0;
    const f1 = (precision + recall) > 0 ? (2 * precision * recall / (precision + recall)) : 0;
    return { accuracy: accuracy.toFixed(1), precision: precision.toFixed(1), recall: recall.toFixed(1), f1: f1.toFixed(1), total };
  }, [tp, fp, fn, tn]);

  const maxVal = Math.max(tp, fp, fn, tn, 1);

  return (
    <SimulatorLayout topicId="confusion-matrix" topicName="Confusion Matrix">
      <h1 className="text-2xl font-bold font-display mb-1 text-foreground">Confusion Matrix</h1>
      <p className="text-muted-foreground text-sm mb-6">Adjust TP, FP, FN, TN and see metrics update live.</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-card border border-border rounded-xl p-6">
            {/* Matrix */}
            <div className="max-w-md mx-auto">
              <div className="grid grid-cols-3 gap-1 text-center text-sm">
                <div></div>
                <div className="font-medium text-foreground py-2">Predicted +</div>
                <div className="font-medium text-foreground py-2">Predicted -</div>
                <div className="font-medium text-foreground py-2 text-right pr-3">Actual +</div>
                <div className="rounded-lg p-6 transition-all" style={{ backgroundColor: `hsl(152, 70%, ${85 - (tp / maxVal) * 40}%)` }}>
                  <p className="text-xs text-muted-foreground">TP</p>
                  <p className="text-3xl font-bold font-display text-foreground">{tp}</p>
                </div>
                <div className="rounded-lg p-6 transition-all" style={{ backgroundColor: `hsl(0, 84%, ${90 - (fn / maxVal) * 30}%)` }}>
                  <p className="text-xs text-muted-foreground">FN</p>
                  <p className="text-3xl font-bold font-display text-foreground">{fn}</p>
                </div>
                <div className="font-medium text-foreground py-2 text-right pr-3">Actual -</div>
                <div className="rounded-lg p-6 transition-all" style={{ backgroundColor: `hsl(0, 84%, ${90 - (fp / maxVal) * 30}%)` }}>
                  <p className="text-xs text-muted-foreground">FP</p>
                  <p className="text-3xl font-bold font-display text-foreground">{fp}</p>
                </div>
                <div className="rounded-lg p-6 transition-all" style={{ backgroundColor: `hsl(152, 70%, ${85 - (tn / maxVal) * 40}%)` }}>
                  <p className="text-xs text-muted-foreground">TN</p>
                  <p className="text-3xl font-bold font-display text-foreground">{tn}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-card border border-border rounded-xl p-5 shadow-card space-y-3">
              <div>
                <label className="text-sm font-medium text-foreground">TP: {tp}</label>
                <Slider value={[tp]} onValueChange={v => setTp(v[0])} min={0} max={100} className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">FP: {fp}</label>
                <Slider value={[fp]} onValueChange={v => setFp(v[0])} min={0} max={100} className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">FN: {fn}</label>
                <Slider value={[fn]} onValueChange={v => setFn(v[0])} min={0} max={100} className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">TN: {tn}</label>
                <Slider value={[tn]} onValueChange={v => setTn(v[0])} min={0} max={100} className="mt-1" />
              </div>
            </div>
            <div className="bg-card border border-border rounded-xl p-5 shadow-card">
              <p className="font-medium text-foreground text-sm mb-3">Metrics</p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Accuracy', value: metrics.accuracy + '%' },
                  { label: 'Precision', value: metrics.precision + '%' },
                  { label: 'Recall', value: metrics.recall + '%' },
                  { label: 'F1 Score', value: metrics.f1 + '%' },
                ].map(m => (
                  <div key={m.label} className="bg-muted rounded-lg p-3 text-center">
                    <p className="text-xs text-muted-foreground">{m.label}</p>
                    <p className="text-lg font-bold font-display text-foreground">{m.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
      </div>
    </SimulatorLayout>
  );
}
