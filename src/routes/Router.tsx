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
import TransactionsCashiers from '@/components/pages/transactions/cashiers';
import OperatingExpenses from '@/components/pages/transactions/operating-expenses';
import DebtorsClients from '@/components/pages/debtors';
import ProductCategories from '@/components/pages/products/categories';
import ProductSizes from '@/components/pages/products/sizes';
import ProductUnits from '@/components/pages/products/units';
import Orders from '@/components/pages/orders';
import ProductsReport from '@/components/pages/reports/products';
import CurrentCashier from '@/components/pages/transactions/cashiers/current-cashier';
import CashierDetail from '@/components/pages/transactions/cashiers/detail';

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

        {/* PRODUCTS ROUTES - START */}
        <Route path={APP_ROUTES.PRIVATE.DASHBOARD.PRODUCTS.path} element={<Products />} />
        <Route path={APP_ROUTES.PRIVATE.DASHBOARD.PRODUCTS.CATEGORIES.path} element={<ProductCategories />} />
        <Route path={APP_ROUTES.PRIVATE.DASHBOARD.PRODUCTS.SIZES.path} element={<ProductSizes />} />
        <Route path={APP_ROUTES.PRIVATE.DASHBOARD.PRODUCTS.UNITS.path} element={<ProductUnits />} />
        <Route path={APP_ROUTES.PRIVATE.DASHBOARD.PRODUCT_EDITOR.path} element={<ProductEditor />} />
        {/* PRODUCTS ROUTES - END */}

        {/* ORDERS ROUTES - START */}
        <Route path={APP_ROUTES.PRIVATE.DASHBOARD.ORDERS.path} element={<Orders />} />
        {/* ORDERS ROUTES - END */}

        {/* TRANSACTIONS ROUTES - START */}
        <Route path={APP_ROUTES.PRIVATE.DASHBOARD.TRANSACTIONS.CASHIERS.path} element={<TransactionsCashiers />} />
        <Route path={APP_ROUTES.PRIVATE.DASHBOARD.TRANSACTIONS.CASHIER_DETAIL.path} element={<CashierDetail />} />
        <Route path={APP_ROUTES.PRIVATE.DASHBOARD.TRANSACTIONS.CURRENT_CASHIER.path} element={<CurrentCashier />} />
        <Route path={APP_ROUTES.PRIVATE.DASHBOARD.TRANSACTIONS.OPERATING_EXPENSES.path} element={<OperatingExpenses />} />
        {/* TRANSACTIONS ROUTES - END */}

        {/* REPORTS ROUTES - START */}
        <Route path={APP_ROUTES.PRIVATE.DASHBOARD.REPORTS.PRODUCTS.path} element={<ProductsReport />} />
        {/* REPORTS ROUTES - END */}

        <Route path={APP_ROUTES.PRIVATE.DASHBOARD.CUSTOMERS.path} element={<Customers />} />
        <Route path={APP_ROUTES.PRIVATE.DASHBOARD.SALES.path} element={<Sales />} />
        <Route path={APP_ROUTES.PRIVATE.DASHBOARD.SALE_DETAIL.path} element={<SaleDetail />} />

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
