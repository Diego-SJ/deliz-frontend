import MainLayout from '@/components/organisms/MainLayout';
import SignIn from '@/components/pages/auth/signIn';
import SignUp from '@/components/pages/auth/signup';
import Dashboard from '@/components/pages/dashboard';
import { APP_ROUTES } from '@/constants/routes';
import { Route, Routes } from 'react-router-dom';

const AppRouter = () => {
  return (
    <Routes>
      <Route path={APP_ROUTES.AUTH.MAIN}>
        <Route path={APP_ROUTES.AUTH.SIGN_IN} element={<SignIn />} />
        <Route path={APP_ROUTES.AUTH.SIGN_UP} element={<SignUp />} />
      </Route>
      <Route path={APP_ROUTES.PRIVATE.MAIN} element={<MainLayout />}>
        <Route path={APP_ROUTES.PRIVATE.DASHBOARD.HOME} element={<Dashboard />} />
      </Route>
    </Routes>
  );
};

export default AppRouter;
