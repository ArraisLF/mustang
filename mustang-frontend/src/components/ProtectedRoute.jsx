import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-dark-bg">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary dark:border-accent" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
