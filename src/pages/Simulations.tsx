import { useSearchParams, Link } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { domains } from '@/data/topics';
import { Lock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Simulations() {
  const [params] = useSearchParams();
  const domainFilter = params.get('domain');

  const filteredDomains = domainFilter
    ? domains.filter(d => d.id === domainFilter)
    : domains;

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold font-display mb-2 text-foreground">Simulations</h1>
        <p className="text-muted-foreground mb-10">Click on any available simulation to start experimenting</p>

        {/* Domain filter tabs */}
        <div className="flex flex-wrap gap-2 mb-10">
          <Link to="/simulations">
            <button className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${!domainFilter ? 'gradient-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-muted'}`}>
              All
            </button>
          </Link>
          {domains.map(d => (
            <Link key={d.id} to={`/simulations?domain=${d.id}`}>
              <button className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${domainFilter === d.id ? 'gradient-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-muted'}`}>
                {d.title}
              </button>
            </Link>
          ))}
        </div>

        {filteredDomains.map(domain => (
          <div key={domain.id} className="mb-12">
            <h2 className="text-xl font-bold font-display text-foreground mb-1">{domain.title}</h2>
            <p className="text-sm text-muted-foreground mb-6">{domain.description}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {domain.topics.map((topic, idx) => (
                <motion.div
                  key={topic.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  {topic.available ? (
                    <Link to={topic.route}>
                      <div className="bg-card border border-border rounded-xl p-5 hover:shadow-elevated hover:-translate-y-0.5 transition-all duration-300 cursor-pointer group h-full">
                        <div className="flex justify-between items-start mb-3">
                          <span className="text-xs font-medium text-muted-foreground">{topic.category}</span>
                          <span className="tag-available">Available</span>
                        </div>
                        <h3 className="font-bold text-foreground group-hover:text-primary transition-colors mb-1">{topic.title}</h3>
                        <p className="text-sm text-muted-foreground">{topic.description}</p>
                      </div>
                    </Link>
                  ) : (
                    <div className="bg-card border border-border rounded-xl p-5 opacity-60 h-full">
                      <div className="flex justify-between items-start mb-3">
                        <span className="text-xs font-medium text-muted-foreground">{topic.category}</span>
                        <span className="tag-coming-soon"><Lock className="h-3 w-3 inline mr-1" />Coming Soon</span>
                      </div>
                      <h3 className="font-bold text-foreground mb-1">{topic.title}</h3>
                      <p className="text-sm text-muted-foreground">{topic.description}</p>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </AppLayout>
  );
}
