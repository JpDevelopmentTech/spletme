import type { ReactNode } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../store/store';

interface GuardedRouteProps {
  children: ReactNode;
}

const GuardedRoute = ({ children }: GuardedRouteProps) => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuth);

  if (isAuthenticated !== 'true') {
    return null;
  }

  return children;
};

export default GuardedRoute;
