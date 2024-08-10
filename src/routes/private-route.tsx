import { APP_ROUTES } from '@/routes/routes';
import { useAppSelector } from '@/hooks/useStore';
import { Navigate } from 'react-router-dom';
import { STATUS_DATA } from '@/constants/status';

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const { user_auth } = useAppSelector(({ users }) => users);
  const { status_id } = useAppSelector(({ app }) => app.onboarding);

  if (!user_auth?.authenticated) return <Navigate to={APP_ROUTES.AUTH.SIGN_IN_ADMIN.path} replace />;
  else if (user_auth?.authenticated && status_id === STATUS_DATA.PENDING.id)
    return <Navigate to={APP_ROUTES.AUTH.SIGN_UP.ONBOARDING.path} replace />;
  return children;
};

export default PrivateRoute;
