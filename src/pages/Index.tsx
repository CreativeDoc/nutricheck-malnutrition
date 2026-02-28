import { Login } from './Login';
import { Dashboard } from './Dashboard';
import { useAuthContext } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

const Index = () => {
  const { session, loading } = useAuthContext();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!session) {
    return <Login />;
  }

  return <Dashboard />;
};

export default Index;
