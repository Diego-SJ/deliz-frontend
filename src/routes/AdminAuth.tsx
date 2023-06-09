import { APP_ROUTES } from '@/constants/routes';
import { useAppSelector } from '@/hooks/useStore';
import { Navigate, useLocation } from 'react-router-dom';

const ADMIN_PATH = APP_ROUTES.AUTH.SIGN_IN_ADMIN.path;
const AdminAuth = ({ children }: { children: JSX.Element }) => {
  const { user_auth } = useAppSelector(({ users }) => users);
  const location = useLocation();

  if (!user_auth?.user?.id && location?.pathname !== ADMIN_PATH) return <Navigate to={ADMIN_PATH} replace />;
  else if (!!user_auth?.user?.id && location?.pathname === ADMIN_PATH)
    return <Navigate to={APP_ROUTES.PRIVATE.DASHBOARD.HOME.path} replace />;
  return children;
};

export default AdminAuth;
