import MainLayout from '@/components/organisms/MainLayout';
import SignIn from '@/components/pages/auth/signIn';
import SignUp from '@/components/pages/auth/signup';
import Dashboard from '@/components/pages/dashboard';
import { APP_ROUTES } from '@/constants/routes';
import { Navigate, Route, Routes } from 'react-router-dom';

const AppRouter = () => {
  return (
    <Routes>
      <Route path={APP_ROUTES.AUTH.MAIN.path}>
        <Route path={APP_ROUTES.AUTH.SIGN_IN.path} element={<SignIn />} />
        <Route path={APP_ROUTES.AUTH.SIGN_UP.path} element={<SignUp />} />
      </Route>
      <Route path={APP_ROUTES.PRIVATE.MAIN} element={<MainLayout />}>
        <Route path={APP_ROUTES.PRIVATE.DASHBOARD.HOME.path} element={<Dashboard />} />
        <Route path={APP_ROUTES.PRIVATE.DASHBOARD.PRODUCTS.path} element={<div>PRODUCTS</div>} />
        <Route path={APP_ROUTES.PRIVATE.DASHBOARD.CUSTOMERS.path} element={<div>CUSTOMERS</div>} />
        <Route path={APP_ROUTES.PRIVATE.DASHBOARD.ORDERS.path} element={<div>ORDERS</div>} />
        <Route path={APP_ROUTES.PRIVATE.DASHBOARD.REPORTS.path} element={<div>REPORTS</div>} />
        <Route path={APP_ROUTES.PRIVATE.DASHBOARD.SETTINGS.path} element={<div>SETTINGS</div>} />
      </Route>
      <Route path="*" element={<Navigate to={APP_ROUTES.AUTH.SIGN_IN.path} replace />} />
    </Routes>
  );
};

export default AppRouter;
