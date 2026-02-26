import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { useAuth } from '@/lib/auth';
import { domains } from '@/data/topics';
import { quizzes, getQuizByTopicId } from '@/data/quizData';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle2, XCircle, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Quiz() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const quiz = selectedTopic ? getQuizByTopicId(selectedTopic) : null;

  if (!user) {
    return (
      <AppLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold font-display mb-3 text-foreground">Login Required</h2>
            <p className="text-muted-foreground mb-6">You need to log in to take quizzes and track your progress.</p>
            <Link to="/login"><Button className="gradient-primary text-primary-foreground">Log In</Button></Link>
          </div>
        </div>
      </AppLayout>
    );
  }

  const handleSubmit = async () => {
    if (!quiz || !user) return;
    const score = quiz.questions.reduce((s, q, i) => s + (answers[i] === q.correctIndex ? 1 : 0), 0);
    const percentage = (score / quiz.questions.length) * 100;

    setSubmitted(true);

    // Save to db
    await supabase.from('quiz_attempts').insert({
      user_id: user.id,
      domain_name: quiz.domainName,
      topic_name: quiz.topicName,
      score,
      total_questions: quiz.questions.length,
      percentage,
    });

    // Update progress
    const { data: existing } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', user.id)
      .eq('topic_name', quiz.topicName)
      .single();

    if (existing) {
      await supabase.from('user_progress').update({
        last_score: score,
        best_score: Math.max(existing.best_score, score),
        completed: true,
      }).eq('user_id', user.id).eq('topic_name', quiz.topicName);
    } else {
      await supabase.from('user_progress').insert({
        user_id: user.id,
        topic_name: quiz.topicName,
        last_score: score,
        best_score: score,
        completed: true,
      });
    }

    toast({ title: `Score: ${score}/${quiz.questions.length}`, description: `${percentage.toFixed(0)}% correct` });
  };

  if (!selectedTopic) {
    return (
      <AppLayout>
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold font-display mb-2 text-foreground">Quizzes</h1>
          <p className="text-muted-foreground mb-10">Test your knowledge on each topic</p>

          {domains.map(domain => {
            const availableQuizzes = domain.topics.filter(t => t.available && quizzes.some(q => q.topicId === t.id));
            if (availableQuizzes.length === 0) return null;
            return (
              <div key={domain.id} className="mb-8">
                <h2 className="text-xl font-bold font-display text-foreground mb-4">{domain.title}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {availableQuizzes.map(topic => (
                    <button
                      key={topic.id}
                      onClick={() => { setSelectedTopic(topic.id); setAnswers({}); setSubmitted(false); }}
                      className="bg-card border border-border rounded-xl p-5 text-left hover:shadow-elevated hover:-translate-y-0.5 transition-all duration-300"
                    >
                      <h3 className="font-bold text-foreground mb-1">{topic.title}</h3>
                      <p className="text-sm text-muted-foreground">{getQuizByTopicId(topic.id)?.questions.length} questions</p>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </AppLayout>
    );
  }

  if (!quiz) return null;

  const score = quiz.questions.reduce((s, q, i) => s + (answers[i] === q.correctIndex ? 1 : 0), 0);

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <button onClick={() => setSelectedTopic(null)} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4" /> Back to quizzes
        </button>

        <h1 className="text-2xl font-bold font-display mb-1 text-foreground">{quiz.topicName} Quiz</h1>
        <p className="text-sm text-muted-foreground mb-8">{quiz.domainName} • {quiz.questions.length} questions</p>

        {submitted && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border rounded-xl p-6 mb-8 text-center shadow-card">
            <p className="text-3xl font-bold font-display text-foreground mb-1">{score}/{quiz.questions.length}</p>
            <p className="text-lg text-muted-foreground">{((score / quiz.questions.length) * 100).toFixed(0)}% correct</p>
            <Button onClick={() => { setAnswers({}); setSubmitted(false); }} variant="outline" className="mt-4" size="sm">Retry</Button>
          </motion.div>
        )}

        <div className="space-y-6">
          {quiz.questions.map((q, qi) => (
            <div key={qi} className="bg-card border border-border rounded-xl p-5 shadow-card">
              <p className="font-medium text-foreground mb-3">{qi + 1}. {q.question}</p>
              <div className="space-y-2">
                {q.options.map((opt, oi) => {
                  const isSelected = answers[qi] === oi;
                  const isCorrect = submitted && oi === q.correctIndex;
                  const isWrong = submitted && isSelected && oi !== q.correctIndex;
                  return (
                    <button
                      key={oi}
                      onClick={() => !submitted && setAnswers(prev => ({ ...prev, [qi]: oi }))}
                      disabled={submitted}
                      className={`w-full text-left px-4 py-3 rounded-lg text-sm transition-all border ${
                        isCorrect ? 'bg-success/10 border-success text-foreground' :
                        isWrong ? 'bg-destructive/10 border-destructive text-foreground' :
                        isSelected ? 'bg-primary/10 border-primary text-foreground' :
                        'border-border text-muted-foreground hover:border-primary/30'
                      }`}
                    >
                      <span className="flex items-center justify-between">
                        {opt}
                        {isCorrect && <CheckCircle2 className="h-4 w-4 text-success" />}
                        {isWrong && <XCircle className="h-4 w-4 text-destructive" />}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {!submitted && (
          <Button
            onClick={handleSubmit}
            disabled={Object.keys(answers).length < quiz.questions.length}
            className="w-full mt-8 gradient-primary text-primary-foreground"
            size="lg"
          >
            Submit Quiz ({Object.keys(answers).length}/{quiz.questions.length} answered)
          </Button>
        )}
      </div>
    </AppLayout>
  );
}
