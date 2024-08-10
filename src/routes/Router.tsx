import MainLayout, { PaddingLayout } from '@/components/organisms/MainLayout';
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
import Login from '@/components/pages/auth/login';
import Home from '@/components/pages/lading-page';
import ProductsCatalog from '@/components/pages/products/catalog';
import TransactionsCashiers from '@/components/pages/cash_cuts';
import DebtorsClients from '@/components/pages/debtors';
import ProductSizes from '@/components/pages/settings/sizes';
import ProductUnits from '@/components/pages/settings/units';
import Orders from '@/components/pages/orders';
import CurrentCashier from '@/components/pages/cash_cuts/current-cash-cut';
import CashierDetail from '@/components/pages/cash_cuts/detail';
import SettingsPage from '@/components/pages/settings';
import BranchesPage from '@/components/pages/settings/branches';
import AddBranchForm from '@/components/pages/settings/branches/add-branch-form';
import SettingsMenu from '@/components/pages/settings/menu';
import useMediaQuery from '@/hooks/useMediaQueries';
import GeneralSettingsPage from '@/components/pages/settings/general';
import PricesListPage from '@/components/pages/settings/prices-list';
import CategoriesPage from '@/components/pages/settings/categories';
import CashRegistersPage from '@/components/pages/settings/cash-registers';
import UsersSettingsPage from '@/components/pages/settings/users';
import ManageUserProfile from '@/components/pages/settings/users/add-user-form';
import { useAppSelector } from '@/hooks/useStore';
import PurchasesExpenses from '@/components/pages/operating-costs';
import AddOperationPurchaseExpense from '@/components/pages/operating-costs/add-operation';
import SignUpSteps from '@/components/pages/auth/signup/steps';
import PrivateRoute from './private-route';
import { STATUS_DATA } from '@/constants/status';
import ReportsHomePage from '@/components/pages/reports';
import ReportsLayout from '@/components/pages/reports/layout';

const AppRouter = () => {
  const { isTablet } = useMediaQuery();
  const { permissions } = useAppSelector(({ users }) => users.user_auth.profile!);
  const { isAdmin, authenticated } = useAppSelector(({ users }) => users.user_auth);
  const { status_id } = useAppSelector(({ app }) => app?.onboarding || { status_id: null });

  return (
    <Routes>
      {/* landing page */}
      <Route path={APP_ROUTES.AUTH.MAIN.path} element={<Home />} />

      {/* Online store */}
      <Route path={APP_ROUTES.PUBLIC.PRODUCTS.path} element={<ProductsCatalog />} />

      {!authenticated && (
        <>
          <Route path={APP_ROUTES.AUTH.SIGN_IN_ADMIN.path} element={<Login />} />
          <Route path={APP_ROUTES.AUTH.SIGN_UP.path} element={<SignUp />} />
        </>
      )}

      {status_id !== STATUS_DATA.COMPLETED.id && !!authenticated && (
        <Route path={APP_ROUTES.AUTH.SIGN_UP.ONBOARDING.path} element={<SignUpSteps />} />
      )}

      <Route
        path={APP_ROUTES.PRIVATE.CASH_REGISTER.MAIN.path}
        element={
          <PrivateRoute>
            <CashRegister />
          </PrivateRoute>
        }
      />
      <Route
        path={APP_ROUTES.PRIVATE.MAIN}
        element={
          <PrivateRoute>
            <MainLayout />
          </PrivateRoute>
        }
      >
        <Route path={APP_ROUTES.PRIVATE.DASHBOARD.HOME.path} element={<Dashboard />} />

        {/* PRODUCTS ROUTES - START */}
        {permissions?.products?.view_catalog && (
          <>
            <Route
              path={APP_ROUTES.PRIVATE.DASHBOARD.PRODUCTS.path}
              element={
                <PaddingLayout>
                  <Products />
                </PaddingLayout>
              }
            />
            <Route path={APP_ROUTES.PRIVATE.DASHBOARD.PRODUCT_EDITOR.path} element={<ProductEditor />} />
          </>
        )}

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
        {permissions?.cash_registers?.view_history_cash_cuts && (
          <>
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
          </>
        )}
        {permissions?.cash_registers?.view_current_cash_cut && (
          <Route
            path={APP_ROUTES.PRIVATE.DASHBOARD.TRANSACTIONS.CURRENT_CASHIER.path}
            element={
              <PaddingLayout>
                <CurrentCashier />
              </PaddingLayout>
            }
          />
        )}
        {/* TRANSACTIONS ROUTES - END */}

        {permissions?.customers?.view_customers && (
          <Route
            path={APP_ROUTES.PRIVATE.DASHBOARD.CUSTOMERS.path}
            element={
              <PaddingLayout>
                <Customers />
              </PaddingLayout>
            }
          />
        )}
        {permissions?.sales?.view_sales && (
          <>
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
          </>
        )}

        {/* PURCHASES EXPENSES ROUTES - START */}

        {permissions?.expenses?.view_expenses && (
          <>
            <Route
              path={APP_ROUTES.PRIVATE.DASHBOARD.PURCHASES_EXPENSES.path}
              element={
                <PaddingLayout>
                  <PurchasesExpenses />
                </PaddingLayout>
              }
            />
            <Route
              path={APP_ROUTES.PRIVATE.DASHBOARD.PURCHASES_EXPENSES.ADD_NEW.path}
              element={<AddOperationPurchaseExpense />}
            />
            <Route path={APP_ROUTES.PRIVATE.DASHBOARD.PURCHASES_EXPENSES.EDIT.path} element={<AddOperationPurchaseExpense />} />
          </>
        )}

        {/* PURCHASES EXPENSES ROUTES - END */}

        {/* SETTINGS ROUTES - START */}
        <Route path={APP_ROUTES.PRIVATE.DASHBOARD.SETTINGS.path} element={<SettingsPage />}>
          {isTablet && <Route path={APP_ROUTES.PRIVATE.DASHBOARD.SETTINGS.path} element={<SettingsMenu />} />}
          <Route path={APP_ROUTES.PRIVATE.DASHBOARD.SETTINGS.path + '/general'} element={<GeneralSettingsPage />} />
          <Route path={APP_ROUTES.PRIVATE.DASHBOARD.SETTINGS.GENERAL.path} element={<GeneralSettingsPage />} />
          {permissions?.branches?.view_branches && (
            <>
              <Route path={APP_ROUTES.PRIVATE.DASHBOARD.SETTINGS.BRANCHES.path} element={<BranchesPage />} />
              <Route path={APP_ROUTES.PRIVATE.DASHBOARD.SETTINGS.BRANCHES.ADD.path} element={<AddBranchForm />} />
              <Route path={APP_ROUTES.PRIVATE.DASHBOARD.SETTINGS.BRANCHES.EDIT.path} element={<AddBranchForm />} />
            </>
          )}

          {permissions?.sizes?.view_sizes && (
            <Route path={APP_ROUTES.PRIVATE.DASHBOARD.SETTINGS.SIZES.path} element={<ProductSizes />} />
          )}

          {permissions?.units?.view_units && (
            <Route path={APP_ROUTES.PRIVATE.DASHBOARD.SETTINGS.UNITS.path} element={<ProductUnits />} />
          )}

          {permissions?.cash_registers?.view_cash_registers && (
            <Route path={APP_ROUTES.PRIVATE.DASHBOARD.SETTINGS.PRICES_LIST.path} element={<PricesListPage />} />
          )}
          {permissions?.categories?.view_categories && (
            <Route path={APP_ROUTES.PRIVATE.DASHBOARD.SETTINGS.CATEGORIES.path} element={<CategoriesPage />} />
          )}

          {permissions?.cash_registers?.view_cash_registers && (
            <Route path={APP_ROUTES.PRIVATE.DASHBOARD.SETTINGS.CASH_REGISTERS.path} element={<CashRegistersPage />} />
          )}

          {isAdmin && (
            <>
              <Route path={APP_ROUTES.PRIVATE.DASHBOARD.SETTINGS.USERS.path} element={<UsersSettingsPage />} />
              <Route path={APP_ROUTES.PRIVATE.DASHBOARD.SETTINGS.USERS.ADD.path} element={<ManageUserProfile />} />
              <Route path={APP_ROUTES.PRIVATE.DASHBOARD.SETTINGS.USERS.EDIT.path} element={<ManageUserProfile />} />
            </>
          )}
        </Route>
        {/* SETTINGS ROUTES - END */}

        <Route path={APP_ROUTES.PRIVATE.DASHBOARD.DEBTORS.path} element={<DebtorsClients />} />
        <Route
          path={APP_ROUTES.PRIVATE.DASHBOARD.REPORTS.path}
          element={
            <ReportsLayout>
              <ReportsHomePage />
            </ReportsLayout>
          }
        />
      </Route>

      <Route path="*" element={<Navigate to={APP_ROUTES.PRIVATE.DASHBOARD.HOME.path} replace />} />
    </Routes>
  );
};

export default AppRouter;
