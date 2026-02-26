import { useEffect, useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import { domains } from '@/data/topics';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Award, TrendingUp, TrendingDown } from 'lucide-react';

interface DomainProgress {
  domain: string;
  progress: number;
  topicScores: { topic: string; percentage: number; bestScore: number; lastScore: number }[];
}

function ProgressCircle({ value, label, size = 120 }: { value: number; label: string; size?: number }) {
  const r = (size - 16) / 2;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="flex flex-col items-center group cursor-pointer">
      <div className="relative">
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="hsl(var(--muted))" strokeWidth={8} />
          <motion.circle
            cx={size / 2} cy={size / 2} r={r} fill="none" stroke="hsl(var(--primary))" strokeWidth={8}
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1, ease: 'easeOut' }}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold font-display text-foreground">{value.toFixed(0)}%</span>
        </div>
      </div>
      <p className="text-sm font-medium text-foreground mt-2">{label}</p>
      {/* Hover tooltip */}
      <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -bottom-8 bg-card border border-border rounded-lg px-3 py-1.5 shadow-elevated text-xs text-muted-foreground whitespace-nowrap pointer-events-none">
        {value.toFixed(1)}% complete
      </div>
    </div>
  );
}

function getBadge(avgProgress: number) {
  if (avgProgress >= 80) return { label: 'Advanced Learner', color: 'gradient-accent', icon: Award };
  if (avgProgress >= 50) return { label: 'Intermediate', color: 'gradient-primary', icon: TrendingUp };
  return null;
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

      const { data: progressData } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user!.id);

      const progress: DomainProgress[] = domains.map(domain => {
        const availableTopics = domain.topics.filter(t => t.available);
        const topicScores = availableTopics.map(topic => {
          const topicAttempts = attempts.filter(a => a.topic_name === topic.title);
          const bestPercentage = topicAttempts.length > 0
            ? Math.max(...topicAttempts.map(a => a.percentage))
            : 0;
          const prog = progressData?.find(p => p.topic_name === topic.title);
          return {
            topic: topic.title,
            percentage: bestPercentage,
            bestScore: prog?.best_score || 0,
            lastScore: prog?.last_score || 0,
          };
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

  const overallAvg = domainProgress.length > 0
    ? domainProgress.reduce((s, d) => s + d.progress, 0) / domainProgress.length
    : 0;
  const badge = getBadge(overallAvg);

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
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold font-display text-foreground">Dashboard</h1>
          {badge && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className={`flex items-center gap-2 ${badge.color} text-primary-foreground px-4 py-2 rounded-full text-sm font-semibold shadow-elevated`}
            >
              <badge.icon className="h-4 w-4" />
              {badge.label}
            </motion.div>
          )}
        </div>
        <p className="text-muted-foreground mb-10">Track your learning progress across all domains</p>

        {loading ? (
          <div className="text-center py-20 text-muted-foreground">Loading...</div>
        ) : (
          <>
            {/* Progress circles */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-14">
              {domainProgress.map((dp, i) => (
                <motion.div key={dp.domain} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}>
                  <div className="bg-card border border-border rounded-xl p-6 shadow-card flex justify-center relative">
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
                      <div key={ts.topic} className="flex items-center gap-3 group">
                        <span className="text-sm text-muted-foreground flex-1">{ts.topic}</span>
                        <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                          <motion.div
                            className="h-full gradient-primary rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${ts.percentage}%` }}
                            transition={{ duration: 0.8, ease: 'easeOut' }}
                          />
                        </div>
                        <span className="text-sm font-medium text-foreground w-12 text-right">{ts.percentage.toFixed(0)}%</span>
                        {ts.bestScore > 0 && ts.lastScore > 0 && (
                          <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                            {ts.lastScore >= ts.bestScore ? (
                              <TrendingUp className="h-3.5 w-3.5 text-accent" />
                            ) : (
                              <TrendingDown className="h-3.5 w-3.5 text-destructive" />
                            )}
                          </span>
                        )}
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
                      <tr key={a.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
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
