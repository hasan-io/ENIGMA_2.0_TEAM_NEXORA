import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Brain, LogOut, LayoutDashboard, User, Menu, X } from 'lucide-react';
import { useState } from 'react';

export function Navbar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 glass border-b border-border">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center gap-2 font-display text-xl font-bold text-foreground">
          <Brain className="h-7 w-7 text-primary" />
          <span>ML<span className="text-primary">Lab</span></span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/simulations" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Simulations
          </Link>
          {user && (
            <>
              <Link to="/quiz" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Quizzes
              </Link>
              <Link to="/dashboard" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Dashboard
              </Link>
            </>
          )}
        </div>

        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <Link to="/profile">
                <Button variant="ghost" size="sm"><User className="h-4 w-4 mr-1" /> Profile</Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={() => { signOut(); navigate('/'); }}>
                <LogOut className="h-4 w-4 mr-1" /> Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/login"><Button variant="ghost" size="sm">Log In</Button></Link>
              <Link to="/signup"><Button size="sm" className="gradient-primary text-primary-foreground">Sign Up</Button></Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden text-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-card p-4 space-y-3">
          <Link to="/simulations" onClick={() => setMobileOpen(false)} className="block text-sm font-medium text-muted-foreground">Simulations</Link>
          {user ? (
            <>
              <Link to="/quiz" onClick={() => setMobileOpen(false)} className="block text-sm font-medium text-muted-foreground">Quizzes</Link>
              <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="block text-sm font-medium text-muted-foreground">Dashboard</Link>
              <Link to="/profile" onClick={() => setMobileOpen(false)} className="block text-sm font-medium text-muted-foreground">Profile</Link>
              <Button variant="ghost" size="sm" onClick={() => { signOut(); navigate('/'); setMobileOpen(false); }}>Logout</Button>
            </>
          ) : (
            <div className="flex gap-2">
              <Link to="/login" onClick={() => setMobileOpen(false)}><Button variant="ghost" size="sm">Log In</Button></Link>
              <Link to="/signup" onClick={() => setMobileOpen(false)}><Button size="sm" className="gradient-primary text-primary-foreground">Sign Up</Button></Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
