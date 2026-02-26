import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

interface Props {
  title: string;
  leftLabel: string;
  rightLabel: string;
  leftDescription: string;
  rightDescription: string;
}

export function WhereItBreaks({ title, leftLabel, rightLabel, leftDescription, rightDescription }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-card border border-border rounded-xl p-6 shadow-card mb-6"
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-destructive/10 flex items-center justify-center">
          <AlertTriangle className="h-4 w-4 text-destructive" />
        </div>
        <h2 className="text-lg font-bold font-display text-foreground">{title}</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4">
          <p className="text-sm font-semibold text-destructive mb-2">{leftLabel}</p>
          <p className="text-sm text-muted-foreground">{leftDescription}</p>
        </div>
        <div className="rounded-lg border border-accent/20 bg-accent/5 p-4">
          <p className="text-sm font-semibold text-accent mb-2">{rightLabel}</p>
          <p className="text-sm text-muted-foreground">{rightDescription}</p>
        </div>
      </div>
    </motion.div>
  );
}
