import MainLayout, { PaddingLayout } from '@/components/organisms/MainLayout';
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
import SettingsPage from '@/components/pages/settings';
import BranchesPage from '@/components/pages/settings/branches';
import AddBranchForm from '@/components/pages/settings/branches/add-branch-form';
import SettingsMenu from '@/components/pages/settings/menu';
import useMediaQuery from '@/hooks/useMediaQueries';
import GeneralSettingsPage from '@/components/pages/settings/general';
import PricesListPage from '@/components/pages/settings/prices-list';
import CategoriesPage from '@/components/pages/products/categories';
import ProductSizesPage from '@/components/pages/products/sizes';
import ProductUnitsPage from '@/components/pages/products/units';
import CashRegistersPage from '@/components/pages/settings/cash-registers';
import UsersSettingsPage from '@/components/pages/settings/users';
import ManageUserProfile from '@/components/pages/settings/users/add-user-form';

const AppRouter = () => {
  const { isTablet } = useMediaQuery();
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
        <Route
          path={APP_ROUTES.PRIVATE.DASHBOARD.PRODUCTS.path}
          element={
            <PaddingLayout>
              <Products />
            </PaddingLayout>
          }
        />
        <Route
          path={APP_ROUTES.PRIVATE.DASHBOARD.PRODUCTS.CATEGORIES.path}
          element={
            <PaddingLayout>
              <ProductCategories />
            </PaddingLayout>
          }
        />
        <Route
          path={APP_ROUTES.PRIVATE.DASHBOARD.PRODUCTS.SIZES.path}
          element={
            <PaddingLayout>
              <ProductSizes />
            </PaddingLayout>
          }
        />
        <Route
          path={APP_ROUTES.PRIVATE.DASHBOARD.PRODUCTS.UNITS.path}
          element={
            <PaddingLayout>
              <ProductUnits />
            </PaddingLayout>
          }
        />
        <Route path={APP_ROUTES.PRIVATE.DASHBOARD.PRODUCT_EDITOR.path} element={<ProductEditor />} />
        {/* PRODUCTS ROUTES - END */}

        {/* ORDERS ROUTES - START */}
        <Route
          path={APP_ROUTES.PRIVATE.DASHBOARD.ORDERS.path}
          element={
            <PaddingLayout>
              <Orders />
            </PaddingLayout>
          }
        />
        {/* ORDERS ROUTES - END */}

        {/* TRANSACTIONS ROUTES - START */}
        <Route
          path={APP_ROUTES.PRIVATE.DASHBOARD.TRANSACTIONS.CASHIERS.path}
          element={
            <PaddingLayout>
              <TransactionsCashiers />
            </PaddingLayout>
          }
        />
        <Route
          path={APP_ROUTES.PRIVATE.DASHBOARD.TRANSACTIONS.CASHIER_DETAIL.path}
          element={
            <PaddingLayout>
              <CashierDetail />
            </PaddingLayout>
          }
        />
        <Route
          path={APP_ROUTES.PRIVATE.DASHBOARD.TRANSACTIONS.CURRENT_CASHIER.path}
          element={
            <PaddingLayout>
              <CurrentCashier />
            </PaddingLayout>
          }
        />
        <Route
          path={APP_ROUTES.PRIVATE.DASHBOARD.TRANSACTIONS.OPERATING_EXPENSES.path}
          element={
            <PaddingLayout>
              <OperatingExpenses />
            </PaddingLayout>
          }
        />
        {/* TRANSACTIONS ROUTES - END */}

        {/* REPORTS ROUTES - START */}
        <Route
          path={APP_ROUTES.PRIVATE.DASHBOARD.REPORTS.PRODUCTS.path}
          element={
            <PaddingLayout>
              <ProductsReport />
            </PaddingLayout>
          }
        />
        {/* REPORTS ROUTES - END */}

        <Route
          path={APP_ROUTES.PRIVATE.DASHBOARD.CUSTOMERS.path}
          element={
            <PaddingLayout>
              <Customers />
            </PaddingLayout>
          }
        />
        <Route
          path={APP_ROUTES.PRIVATE.DASHBOARD.SALES.path}
          element={
            <PaddingLayout>
              <Sales />
            </PaddingLayout>
          }
        />
        <Route
          path={APP_ROUTES.PRIVATE.DASHBOARD.SALE_DETAIL.path}
          element={
            <PaddingLayout>
              <SaleDetail />
            </PaddingLayout>
          }
        />

        {/* SETTINGS ROUTES - START */}
        <Route path={APP_ROUTES.PRIVATE.DASHBOARD.SETTINGS.path} element={<SettingsPage />}>
          {isTablet && <Route path={APP_ROUTES.PRIVATE.DASHBOARD.SETTINGS.path} element={<SettingsMenu />} />}
          <Route path={APP_ROUTES.PRIVATE.DASHBOARD.SETTINGS.path + '/general'} element={<GeneralSettingsPage />} />
          <Route path={APP_ROUTES.PRIVATE.DASHBOARD.SETTINGS.GENERAL.path} element={<GeneralSettingsPage />} />
          <Route path={APP_ROUTES.PRIVATE.DASHBOARD.SETTINGS.BRANCHES.path} element={<BranchesPage />} />
          <Route path={APP_ROUTES.PRIVATE.DASHBOARD.SETTINGS.BRANCHES.ADD.path} element={<AddBranchForm />} />
          <Route path={APP_ROUTES.PRIVATE.DASHBOARD.SETTINGS.BRANCHES.EDIT.path} element={<AddBranchForm />} />
          <Route path={APP_ROUTES.PRIVATE.DASHBOARD.SETTINGS.PRICES_LIST.path} element={<PricesListPage />} />
          <Route path={APP_ROUTES.PRIVATE.DASHBOARD.SETTINGS.CATEGORIES.path} element={<CategoriesPage />} />
          <Route path={APP_ROUTES.PRIVATE.DASHBOARD.SETTINGS.SIZES.path} element={<ProductSizesPage />} />
          <Route path={APP_ROUTES.PRIVATE.DASHBOARD.SETTINGS.UNITS.path} element={<ProductUnitsPage />} />
          <Route path={APP_ROUTES.PRIVATE.DASHBOARD.SETTINGS.CASH_REGISTERS.path} element={<CashRegistersPage />} />

          <Route path={APP_ROUTES.PRIVATE.DASHBOARD.SETTINGS.USERS.path} element={<UsersSettingsPage />} />
          <Route path={APP_ROUTES.PRIVATE.DASHBOARD.SETTINGS.USERS.ADD.path} element={<ManageUserProfile />} />
          <Route path={APP_ROUTES.PRIVATE.DASHBOARD.SETTINGS.USERS.EDIT.path} element={<ManageUserProfile />} />
        </Route>
        {/* SETTINGS ROUTES - END */}

        <Route path={APP_ROUTES.PRIVATE.DASHBOARD.DEBTORS.path} element={<DebtorsClients />} />
        <Route path={APP_ROUTES.PRIVATE.DASHBOARD.REPORTS.path} element={<div>REPORTS</div>} />
      </Route>
      <Route path={APP_ROUTES.PRIVATE.CASH_REGISTER.MAIN.path} element={<CashRegister />} />
      <Route path="*" element={<Navigate to={APP_ROUTES.PRIVATE.DASHBOARD.HOME.path} replace />} />
    </Routes>
  );
};

export default AppRouter;
