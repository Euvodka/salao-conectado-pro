
// src/components/PrivateRoute.tsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const { session } = useAuth();

  if (!session) {
    return <Navigate to="/auth/login" />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
