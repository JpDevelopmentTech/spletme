import type { ReactNode } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import type { RootState } from '../store/store';

interface GuardedRouteProps {
  children: ReactNode;
}

const GuardedRoute = ({ children }: GuardedRouteProps) => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuth);
  const location = useLocation();

  if (isAuthenticated !== 'true') {
    return <Navigate to="/auth/email-login" replace state={{ from: location }} />;
  }

  return children;
};

export default GuardedRoute;

export const PublicOnlyRoute = ({ children }: GuardedRouteProps) => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuth);

  if (isAuthenticated === 'true') {
    return <Navigate to="/panel/home" replace />;
  }

  return children;
};
