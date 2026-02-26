import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Play, Pause, ListOrdered } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Step {
  title: string;
  description: string;
}

export function AlgorithmSteps({ steps }: { steps: Step[] }) {
  const [current, setCurrent] = useState(0);
  const [playing, setPlaying] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (playing) {
      intervalRef.current = setInterval(() => {
        setCurrent(prev => {
          if (prev >= steps.length - 1) { setPlaying(false); return prev; }
          return prev + 1;
        });
      }, 2500);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [playing, steps.length]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-card border border-border rounded-xl p-6 shadow-card mb-6"
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
          <ListOrdered className="h-4 w-4 text-primary-foreground" />
        </div>
        <h2 className="text-lg font-bold font-display text-foreground">Algorithm Under the Hood</h2>
      </div>

      {/* Step indicators */}
      <div className="flex gap-1.5 mb-4">
        {steps.map((_, i) => (
          <button
            key={i}
            onClick={() => { setCurrent(i); setPlaying(false); }}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === current ? 'bg-primary flex-[2]' : i < current ? 'bg-primary/40 flex-1' : 'bg-muted flex-1'
            }`}
          />
        ))}
      </div>

      {/* Current step */}
      <motion.div
        key={current}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-muted/50 rounded-lg p-4 mb-4 min-h-[80px]"
      >
        <p className="text-xs font-semibold text-primary mb-1">Step {current + 1} of {steps.length}</p>
        <p className="font-semibold text-foreground text-sm mb-1">{steps[current].title}</p>
        <p className="text-sm text-muted-foreground">{steps[current].description}</p>
      </motion.div>

      {/* Controls */}
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={() => { setCurrent(Math.max(0, current - 1)); setPlaying(false); }} disabled={current === 0}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={() => { if (current === steps.length - 1) setCurrent(0); setPlaying(!playing); }}>
          {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>
        <Button variant="outline" size="sm" onClick={() => { setCurrent(Math.min(steps.length - 1, current + 1)); setPlaying(false); }} disabled={current === steps.length - 1}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  );
}
