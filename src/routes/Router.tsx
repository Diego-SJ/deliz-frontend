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
import TransactionsCashiers from '@/components/pages/cash_cuts';
import ProductSizes from '@/components/pages/settings/sizes';
import ProductUnits from '@/components/pages/settings/units';
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
import OnlineStorePage from '@/components/pages/online-store';
import Membership from '@/components/pages/membership';
import AiChatPage from '@/components/pages/ai-chat';
import SalesReports from '@/components/pages/reports/sales/full-report';
import { useMembershipAccess } from './module-access';
import ProfitReport from '@/components/pages/reports/profit/full-report';
import ExpensesFullReport from '@/components/pages/reports/expenses/full-report';
import CustomersFullReport from '@/components/pages/reports/customers/full-report';
import TermnsAndConditions from '@/components/pages/lading-page/terms-and-conditions';
import PrivacyPolicy from '@/components/pages/lading-page/privacy-policy';
import PrinterPage from '@/components/pages/settings/printer';
import ProductsFullReport from '@/components/pages/reports/products/full-report';

const AppRouter = () => {
  const { isTablet } = useMediaQuery();
  const { hasAccess, hasModuleAccess } = useMembershipAccess();
  const { permissions } = useAppSelector(({ users }) => users?.user_auth.profile! || {});
  const { isAdmin, authenticated } = useAppSelector(({ users }) => users.user_auth);
  const { status_id } = useAppSelector(({ app }) => app?.onboarding || { status_id: null });

  return (
    <Routes>
      {/* Start - landing page */}
      <Route
        path={APP_ROUTES.AUTH.MAIN.path}
        element={authenticated ? <Navigate to={APP_ROUTES.PRIVATE.HOME.path} replace /> : <Home />}
      />

      <Route path={APP_ROUTES.PUBLIC.TERMS_AND_CONDITIONS.path} element={<TermnsAndConditions />} />

      <Route path={APP_ROUTES.PUBLIC.PRIVACY_POLICY.path} element={<PrivacyPolicy />} />
      {/* End - landing page */}

      {!authenticated && (
        <>
          <Route path={APP_ROUTES.AUTH.SIGN_IN_ADMIN.path} element={<Login />} />
          <Route path={APP_ROUTES.AUTH.SIGN_UP.path} element={<SignUp />} />
        </>
      )}

      {status_id !== STATUS_DATA.COMPLETED.id && authenticated && (
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
        <Route path={APP_ROUTES.PRIVATE.HOME.path} element={<Dashboard />} />
        {hasAccess('chat_ia') && <Route path={APP_ROUTES.PRIVATE.AI_CHAT.path} element={<AiChatPage />} />}

        {/* PRODUCTS ROUTES - START */}
        {permissions?.products?.view_catalog?.value && (
          <>
            <Route
              path={APP_ROUTES.PRIVATE.PRODUCTS.path}
              element={
                <PaddingLayout>
                  <Products />
                </PaddingLayout>
              }
            />
            <Route path={APP_ROUTES.PRIVATE.PRODUCT_EDITOR.path} element={<ProductEditor />} />
          </>
        )}
        {/* PRODUCTS ROUTES - END */}

        {/* TRANSACTIONS ROUTES - START */}
        {permissions?.cash_registers?.view_history_cash_cuts?.value && hasAccess('make_cash_cut') ? (
          <>
            <Route
              path={APP_ROUTES.PRIVATE.TRANSACTIONS.CASHIERS.path}
              element={
                <PaddingLayout>
                  <TransactionsCashiers />
                </PaddingLayout>
              }
            />
            <Route
              path={APP_ROUTES.PRIVATE.TRANSACTIONS.CASHIER_DETAIL.path}
              element={
                <PaddingLayout>
                  <CashierDetail />
                </PaddingLayout>
              }
            />
          </>
        ) : null}
        {permissions?.cash_registers?.view_current_cash_cut?.value && hasAccess('make_cash_cut') ? (
          <Route
            path={APP_ROUTES.PRIVATE.TRANSACTIONS.CURRENT_CASHIER.path}
            element={
              <PaddingLayout>
                <CurrentCashier />
              </PaddingLayout>
            }
          />
        ) : null}
        {/* TRANSACTIONS ROUTES - END */}

        {permissions?.customers?.view_customers?.value && (
          <Route
            path={APP_ROUTES.PRIVATE.CUSTOMERS.path}
            element={
              <PaddingLayout>
                <Customers />
              </PaddingLayout>
            }
          />
        )}
        {permissions?.sales?.view_sales?.value && (
          <>
            <Route
              path={APP_ROUTES.PRIVATE.SALES.path}
              element={
                <PaddingLayout>
                  <Sales />
                </PaddingLayout>
              }
            />
            <Route
              path={APP_ROUTES.PRIVATE.SALE_DETAIL.path}
              element={
                <PaddingLayout>
                  <SaleDetail />
                </PaddingLayout>
              }
            />
          </>
        )}

        {/* PURCHASES EXPENSES ROUTES - START */}

        {permissions?.expenses?.view_expenses?.value && hasAccess('expenses') ? (
          <>
            <Route
              path={APP_ROUTES.PRIVATE.PURCHASES_EXPENSES.path}
              element={
                <PaddingLayout>
                  <PurchasesExpenses />
                </PaddingLayout>
              }
            />
            {permissions?.expenses?.add_expense?.value && (
              <Route
                path={APP_ROUTES.PRIVATE.PURCHASES_EXPENSES.ADD_NEW.path}
                element={<AddOperationPurchaseExpense />}
              />
            )}
            {permissions?.expenses?.edit_expense?.value && (
              <Route path={APP_ROUTES.PRIVATE.PURCHASES_EXPENSES.EDIT.path} element={<AddOperationPurchaseExpense />} />
            )}
          </>
        ) : null}

        {/* PURCHASES EXPENSES ROUTES - END */}

        {hasAccess('online_store') && (
          <Route path={APP_ROUTES.PRIVATE.ONLINE_STORE.path} element={<OnlineStorePage />} />
        )}

        {/* SETTINGS ROUTES - START */}
        <Route path={APP_ROUTES.PRIVATE.SETTINGS.path} element={<SettingsPage />}>
          {isTablet && <Route path={APP_ROUTES.PRIVATE.SETTINGS.path} element={<SettingsMenu />} />}
          <Route path={APP_ROUTES.PRIVATE.SETTINGS.path + '/general'} element={<GeneralSettingsPage />} />
          <Route path={APP_ROUTES.PRIVATE.SETTINGS.GENERAL.path} element={<GeneralSettingsPage />} />
          {permissions?.branches?.view_branches?.value && (
            <>
              <Route path={APP_ROUTES.PRIVATE.SETTINGS.BRANCHES.path} element={<BranchesPage />} />
              <Route path={APP_ROUTES.PRIVATE.SETTINGS.BRANCHES.ADD.path} element={<AddBranchForm />} />
              <Route path={APP_ROUTES.PRIVATE.SETTINGS.BRANCHES.EDIT.path} element={<AddBranchForm />} />
            </>
          )}

          {permissions?.sizes?.view_sizes?.value && (
            <Route path={APP_ROUTES.PRIVATE.SETTINGS.SIZES.path} element={<ProductSizes />} />
          )}

          {permissions?.units?.view_units?.value && (
            <Route path={APP_ROUTES.PRIVATE.SETTINGS.UNITS.path} element={<ProductUnits />} />
          )}

          {permissions?.price_list?.view_price_list?.value && (
            <Route path={APP_ROUTES.PRIVATE.SETTINGS.PRICES_LIST.path} element={<PricesListPage />} />
          )}
          {permissions?.categories?.view_categories?.value && (
            <Route path={APP_ROUTES.PRIVATE.SETTINGS.CATEGORIES.path} element={<CategoriesPage />} />
          )}

          {permissions?.cash_registers?.view_cash_registers?.value && (
            <Route path={APP_ROUTES.PRIVATE.SETTINGS.CASH_REGISTERS.path} element={<CashRegistersPage />} />
          )}

          {isAdmin && (
            <>
              <Route path={APP_ROUTES.PRIVATE.SETTINGS.USERS.path} element={<UsersSettingsPage />} />
              <Route path={APP_ROUTES.PRIVATE.SETTINGS.USERS.ADD.path} element={<ManageUserProfile />} />
              <Route path={APP_ROUTES.PRIVATE.SETTINGS.USERS.EDIT.path} element={<ManageUserProfile />} />
            </>
          )}

          <Route path={APP_ROUTES.PRIVATE.SETTINGS.PRINTER.path} element={<PrinterPage />} />
        </Route>
        {/* SETTINGS ROUTES - END */}

        {/* REPORTS ROUTES - START */}
        {(hasModuleAccess(permissions?.reports) || isAdmin) && (
          <Route
            path={APP_ROUTES.PRIVATE.REPORTS.path}
            element={
              <ReportsLayout>
                <ReportsHomePage />
              </ReportsLayout>
            }
          />
        )}
        {permissions?.reports?.view_sales_report?.value && hasAccess('reports') ? (
          <Route
            path={APP_ROUTES.PRIVATE.REPORTS.SALES.path}
            element={
              <ReportsLayout>
                <SalesReports />
              </ReportsLayout>
            }
          />
        ) : null}

        {permissions?.reports?.view_products_report?.value && hasAccess('reports') ? (
          <Route
            path={APP_ROUTES.PRIVATE.REPORTS.PRODUCTS.path}
            element={
              <ReportsLayout>
                <ProductsFullReport />
              </ReportsLayout>
            }
          />
        ) : null}

        {permissions?.reports?.view_profit_report && hasAccess('reports') ? (
          <Route
            path={APP_ROUTES.PRIVATE.REPORTS.PROFIT.path}
            element={
              <ReportsLayout>
                <ProfitReport />
              </ReportsLayout>
            }
          />
        ) : null}

        {permissions?.reports?.view_expenses_report && hasAccess('reports') ? (
          <Route
            path={APP_ROUTES.PRIVATE.REPORTS.EXPENSES.path}
            element={
              <ReportsLayout>
                <ExpensesFullReport />
              </ReportsLayout>
            }
          />
        ) : null}

        {permissions?.reports?.view_customers_report?.value && hasAccess('reports') ? (
          <Route
            path={APP_ROUTES.PRIVATE.REPORTS.CUSTOMERS.path}
            element={
              <ReportsLayout>
                <CustomersFullReport />
              </ReportsLayout>
            }
          />
        ) : null}
        {/* REPORTS ROUTES - END */}

        <Route path={APP_ROUTES.PRIVATE.MEMBERSHIP.path} element={<Membership />} />
      </Route>

      <Route path="*" element={<Navigate to={APP_ROUTES.PRIVATE.HOME.path} replace />} />
    </Routes>
  );
};

export default AppRouter;
