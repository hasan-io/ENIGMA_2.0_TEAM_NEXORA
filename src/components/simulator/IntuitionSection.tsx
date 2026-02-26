import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, Calculator } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  analogy: string;
  bullets: string[];
  formula: string;
  formulaExplanation: string;
}

export function IntuitionSection({ analogy, bullets, formula, formulaExplanation }: Props) {
  const [mathView, setMathView] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-xl p-6 shadow-card mb-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg gradient-accent flex items-center justify-center">
            <Lightbulb className="h-4 w-4 text-accent-foreground" />
          </div>
          <h2 className="text-lg font-bold font-display text-foreground">
            {mathView ? 'Math View' : 'Intuition'}
          </h2>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setMathView(!mathView)}
          className="gap-1.5 text-xs"
        >
          <Calculator className="h-3.5 w-3.5" />
          {mathView ? 'Switch to Intuition' : 'Switch to Math View'}
        </Button>
      </div>

      <AnimatePresence mode="wait">
        {mathView ? (
          <motion.div
            key="math"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <div className="bg-muted rounded-lg p-4 mb-3 font-mono text-sm text-foreground border border-border">
              {formula}
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{formulaExplanation}</p>
          </motion.div>
        ) : (
          <motion.div
            key="intuition"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
          >
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{analogy}</p>
            <ul className="space-y-2">
              {bullets.map((b, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 shrink-0" />
                  <span className="text-foreground">{b}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
