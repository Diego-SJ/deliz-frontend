import MainLayout from '@/components/organisms/MainLayout';
import SignIn from '@/components/pages/auth/signIn';
import SignUp from '@/components/pages/auth/signup';
import Dashboard from '@/components/pages/dashboard';
import Products from '@/components/pages/products';
import ProductEditor from '@/components/pages/products/editor';
import Customers from '@/components/pages/customers';
import Sales from '@/components/pages/sales';
import SaleDetail from '@/components/pages/sales/detail';
import CashRegister from '@/components/pages/cash-register';
import { APP_ROUTES } from '@/routes/routes';
import { Navigate, Route, Routes } from 'react-router-dom';
import SignInAdmin from '@/components/pages/auth/signInAdmin';
import AdminAuth from './AdminAuth';
import Home from '@/components/pages/home';
import ProductsCatalog from '@/components/pages/products/catalog';
import CloseSales from '@/components/pages/close-sales';
import DebtorsClients from '@/components/pages/debtors';

const AppRouter = () => {
  return (
    <Routes>
      <Route path={APP_ROUTES.AUTH.MAIN.path} element={<Home />} />
      <Route path={APP_ROUTES.PUBLIC.PRODUCTS.path} element={<ProductsCatalog />} />
      <Route path={APP_ROUTES.AUTH.SIGN_IN.path} element={<SignIn />} />
      <Route
        path={APP_ROUTES.AUTH.SIGN_IN_ADMIN.path}
        element={
          <AdminAuth>
            <SignInAdmin />
          </AdminAuth>
        }
      />
      <Route path={APP_ROUTES.AUTH.SIGN_UP.path} element={<SignUp />} />
      <Route
        path={APP_ROUTES.PRIVATE.MAIN}
        element={
          <AdminAuth>
            <MainLayout />
          </AdminAuth>
        }
      >
        <Route path={APP_ROUTES.PRIVATE.DASHBOARD.HOME.path} element={<Dashboard />} />
        <Route path={APP_ROUTES.PRIVATE.DASHBOARD.PRODUCTS.path} element={<Products />} />
        <Route path={APP_ROUTES.PRIVATE.DASHBOARD.PRODUCT_EDITOR.path} element={<ProductEditor />} />
        <Route path={APP_ROUTES.PRIVATE.DASHBOARD.CUSTOMERS.path} element={<Customers />} />
        <Route path={APP_ROUTES.PRIVATE.DASHBOARD.SALES.path} element={<Sales />} />
        <Route path={APP_ROUTES.PRIVATE.DASHBOARD.SALE_DETAIL.path} element={<SaleDetail />} />
        <Route path={APP_ROUTES.PRIVATE.DASHBOARD.CUT.path} element={<CloseSales />} />
        <Route path={APP_ROUTES.PRIVATE.DASHBOARD.DEBTORS.path} element={<DebtorsClients />} />
        <Route path={APP_ROUTES.PRIVATE.DASHBOARD.REPORTS.path} element={<div>REPORTS</div>} />
        <Route path={APP_ROUTES.PRIVATE.DASHBOARD.SETTINGS.path} element={<div>SETTINGS</div>} />
      </Route>
      <Route path={APP_ROUTES.PRIVATE.CASH_REGISTER.MAIN.path} element={<CashRegister />} />
      <Route path="*" element={<Navigate to={APP_ROUTES.AUTH.SIGN_IN.path} replace />} />
    </Routes>
  );
};

export default AppRouter;
