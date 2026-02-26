import { useRef, ReactNode } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { IntuitionSection } from './IntuitionSection';
import { AlgorithmSteps } from './AlgorithmSteps';
import { WhereItBreaks } from './WhereItBreaks';
import { AIMentorPanel } from './AIMentorPanel';
import { moduleContents } from '@/data/moduleContent';

interface Props {
  topicId: string;
  topicName: string;
  children: ReactNode;
}

export function SimulatorLayout({ topicId, topicName, children }: Props) {
  const intuitionRef = useRef<HTMLDivElement>(null);
  const simulationRef = useRef<HTMLDivElement>(null);
  const content = moduleContents[topicId];

  const scrollToSection = (section: 'intuition' | 'simulation' | 'quiz') => {
    if (section === 'intuition') intuitionRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (section === 'simulation') simulationRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  if (!content) {
    return (
      <AppLayout>
        <div className="container mx-auto px-4 py-8 max-w-5xl">{children}</div>
        <AIMentorPanel topicId={topicId} topicName={topicName} />
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div ref={intuitionRef}>
          <IntuitionSection {...content.intuition} />
        </div>
        <AlgorithmSteps steps={content.steps} />
        <WhereItBreaks {...content.failures} />
        <div ref={simulationRef}>
          {children}
        </div>
      </div>
      <AIMentorPanel topicId={topicId} topicName={topicName} onScrollToSection={scrollToSection} />
    </AppLayout>
  );
}
