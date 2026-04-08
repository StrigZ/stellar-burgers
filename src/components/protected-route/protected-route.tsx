import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { getUserSelector } from '../../services/user/user-slice';

type Props = {
  children: ReactNode;
  onlyUnAuth?: boolean;
};
export function ProtectedRoute({ children, onlyUnAuth = false }: Props) {
  const location = useLocation();
  const { isAuth } = useSelector(getUserSelector);

  if (onlyUnAuth && isAuth) {
    const from = location.state?.from ?? '/';
    return <Navigate to={from} replace />;
  }

  if (!onlyUnAuth && !isAuth) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
