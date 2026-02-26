import { AppLayout } from '@/components/layout/AppLayout';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Calendar } from 'lucide-react';

export default function Profile() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <AppLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold font-display mb-3 text-foreground">Login Required</h2>
            <Link to="/login"><Button className="gradient-primary text-primary-foreground">Log In</Button></Link>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-12 max-w-lg">
        <h1 className="text-3xl font-bold font-display mb-8 text-foreground">Profile</h1>
        <div className="bg-card border border-border rounded-xl p-8 shadow-card">
          <div className="w-20 h-20 gradient-primary rounded-full flex items-center justify-center mx-auto mb-6">
            <User className="h-10 w-10 text-primary-foreground" />
          </div>
          <div className="space-y-4 text-center">
            <div>
              <p className="text-sm text-muted-foreground">Name</p>
              <p className="text-lg font-medium text-foreground">{user.user_metadata?.name || 'User'}</p>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <p className="text-foreground">{user.email}</p>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Joined {new Date(user.created_at).toLocaleDateString()}</p>
            </div>
          </div>
          <div className="mt-8 flex gap-3 justify-center">
            <Link to="/dashboard"><Button variant="outline" size="sm">View Dashboard</Button></Link>
            <Button variant="outline" size="sm" onClick={() => { signOut(); navigate('/'); }}>
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
