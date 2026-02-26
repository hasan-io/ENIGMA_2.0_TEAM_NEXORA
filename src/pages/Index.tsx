import { Link } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { domains } from '@/data/topics';
import { ArrowRight, Play, Brain, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const Index = () => {
  return (
    <AppLayout>
      {/* Hero */}
      <section className="gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-primary"
              style={{
                width: Math.random() * 6 + 2 + 'px',
                height: Math.random() * 6 + 2 + 'px',
                left: Math.random() * 100 + '%',
                top: Math.random() * 100 + '%',
                opacity: Math.random() * 0.5 + 0.2,
              }}
            />
          ))}
        </div>
        <div className="container mx-auto px-4 py-24 md:py-32 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl mx-auto text-center"
          >
            <div className="inline-flex items-center gap-2 gradient-accent text-accent-foreground px-4 py-1.5 rounded-full text-sm font-medium mb-6">
              <Sparkles className="h-4 w-4" />
              Interactive ML Learning Platform
            </div>
            <h1 className="text-4xl md:text-6xl font-bold font-display text-primary-foreground mb-6 leading-tight">
              Learn Machine Learning by <span className="text-accent">Doing</span>
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/70 mb-10 max-w-2xl mx-auto">
              Interact with real algorithm simulations, tweak parameters in real-time, and build deep intuition for how ML models work.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/simulations">
                <Button size="lg" className="gradient-accent text-accent-foreground font-semibold px-8 gap-2 shadow-elevated">
                  <Play className="h-5 w-5" /> Explore Simulations
                </Button>
              </Link>
              <Link to="/signup">
                <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 gap-2">
                  Get Started <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Domain Cards */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold font-display mb-4 text-foreground">Explore Topics</h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">Dive into interactive simulations across four key areas of machine learning</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {domains.map((domain, idx) => {
            const Icon = domain.icon;
            const availableCount = domain.topics.filter(t => t.available).length;
            return (
              <motion.div
                key={domain.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <Link to={`/simulations?domain=${domain.id}`}>
                  <div className="bg-card rounded-xl p-6 shadow-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-1 border border-border group cursor-pointer h-full">
                    <div className={`w-12 h-12 rounded-lg gradient-primary flex items-center justify-center mb-4`}>
                      <Icon className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <h3 className="text-lg font-bold font-display mb-2 text-foreground group-hover:text-primary transition-colors">{domain.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{domain.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="tag-available">{availableCount} Available</span>
                      {domain.topics.length - availableCount > 0 && (
                        <span className="tag-coming-soon">{domain.topics.length - availableCount} Coming Soon</span>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Features */}
      <section className="bg-card border-y border-border py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
            {[
              { icon: Brain, title: 'Real Math', desc: 'Every simulation uses actual formulas — no black boxes' },
              { icon: Play, title: 'Interactive', desc: 'Tweak parameters with sliders and see results instantly' },
              { icon: Sparkles, title: 'Track Progress', desc: 'Take quizzes and monitor your learning journey' },
            ].map(({ icon: FIcon, title, desc }) => (
              <div key={title}>
                <div className="w-14 h-14 gradient-accent rounded-xl flex items-center justify-center mx-auto mb-4">
                  <FIcon className="h-7 w-7 text-accent-foreground" />
                </div>
                <h3 className="text-lg font-bold font-display mb-2 text-foreground">{title}</h3>
                <p className="text-muted-foreground text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-sm text-muted-foreground border-t border-border">
        <p>© 2026 MLLab — Interactive Machine Learning Platform</p>
      </footer>
    </AppLayout>
  );
};

export default Index;
