import { useEffect, useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import { domains } from '@/data/topics';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface DomainProgress {
  domain: string;
  progress: number;
  topicScores: { topic: string; percentage: number }[];
}

function ProgressCircle({ value, label, size = 120 }: { value: number; label: string; size?: number }) {
  const r = (size - 16) / 2;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="hsl(var(--muted))" strokeWidth={8} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="hsl(var(--primary))" strokeWidth={8}
          strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
          className="transition-all duration-700" />
      </svg>
      <div className="relative -mt-[calc(50%+12px)] flex flex-col items-center justify-center" style={{ height: size }}>
        <span className="text-2xl font-bold font-display text-foreground">{value.toFixed(0)}%</span>
      </div>
      <p className="text-sm font-medium text-foreground mt-2">{label}</p>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const [domainProgress, setDomainProgress] = useState<DomainProgress[]>([]);
  const [recentAttempts, setRecentAttempts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    async function fetchProgress() {
      const { data: attempts } = await supabase
        .from('quiz_attempts')
        .select('*')
        .eq('user_id', user!.id)
        .order('attempted_at', { ascending: false });

      if (!attempts) { setLoading(false); return; }

      setRecentAttempts(attempts.slice(0, 5));

      // Calculate domain progress
      const progress: DomainProgress[] = domains.map(domain => {
        const availableTopics = domain.topics.filter(t => t.available);
        const topicScores = availableTopics.map(topic => {
          const topicAttempts = attempts.filter(a => a.topic_name === topic.title);
          const bestPercentage = topicAttempts.length > 0
            ? Math.max(...topicAttempts.map(a => a.percentage))
            : 0;
          return { topic: topic.title, percentage: bestPercentage };
        });
        const avg = topicScores.length > 0
          ? topicScores.reduce((s, t) => s + t.percentage, 0) / topicScores.length
          : 0;
        return { domain: domain.title, progress: avg, topicScores };
      });

      setDomainProgress(progress);
      setLoading(false);
    }

    fetchProgress();
  }, [user]);

  if (!user) {
    return (
      <AppLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold font-display mb-3 text-foreground">Login Required</h2>
            <p className="text-muted-foreground mb-6">Log in to see your progress dashboard.</p>
            <Link to="/login"><Button className="gradient-primary text-primary-foreground">Log In</Button></Link>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold font-display mb-2 text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mb-10">Track your learning progress across all domains</p>

        {loading ? (
          <div className="text-center py-20 text-muted-foreground">Loading...</div>
        ) : (
          <>
            {/* Progress circles */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-14">
              {domainProgress.map((dp, i) => (
                <motion.div key={dp.domain} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}>
                  <div className="bg-card border border-border rounded-xl p-6 shadow-card flex justify-center">
                    <ProgressCircle value={dp.progress} label={dp.domain} />
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Topic breakdown */}
            <h2 className="text-xl font-bold font-display mb-4 text-foreground">Topic Breakdown</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
              {domainProgress.map(dp => (
                <div key={dp.domain} className="bg-card border border-border rounded-xl p-5 shadow-card">
                  <h3 className="font-bold text-foreground mb-3">{dp.domain}</h3>
                  <div className="space-y-2">
                    {dp.topicScores.map(ts => (
                      <div key={ts.topic} className="flex items-center gap-3">
                        <span className="text-sm text-muted-foreground flex-1">{ts.topic}</span>
                        <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full gradient-primary rounded-full transition-all" style={{ width: `${ts.percentage}%` }} />
                        </div>
                        <span className="text-sm font-medium text-foreground w-12 text-right">{ts.percentage.toFixed(0)}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Recent attempts */}
            <h2 className="text-xl font-bold font-display mb-4 text-foreground">Recent Attempts</h2>
            {recentAttempts.length === 0 ? (
              <div className="bg-card border border-border rounded-xl p-8 text-center">
                <p className="text-muted-foreground">No quiz attempts yet.</p>
                <Link to="/quiz"><Button className="mt-4 gradient-primary text-primary-foreground" size="sm">Take a Quiz</Button></Link>
              </div>
            ) : (
              <div className="bg-card border border-border rounded-xl overflow-hidden shadow-card">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left p-3 text-muted-foreground font-medium">Topic</th>
                      <th className="text-left p-3 text-muted-foreground font-medium">Domain</th>
                      <th className="text-right p-3 text-muted-foreground font-medium">Score</th>
                      <th className="text-right p-3 text-muted-foreground font-medium">%</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentAttempts.map((a: any) => (
                      <tr key={a.id} className="border-b border-border last:border-0">
                        <td className="p-3 text-foreground">{a.topic_name}</td>
                        <td className="p-3 text-muted-foreground">{a.domain_name}</td>
                        <td className="p-3 text-right text-foreground">{a.score}/{a.total_questions}</td>
                        <td className="p-3 text-right font-medium text-foreground">{a.percentage.toFixed(0)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </AppLayout>
  );
}
