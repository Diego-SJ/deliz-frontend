import { APP_ROUTES } from '@/routes/routes';
import { useAppDispatch, useAppSelector } from '@/hooks/useStore';
import { customerActions } from '@/redux/reducers/customers';
import { Customer } from '@/redux/reducers/customers/types';
import { productActions } from '@/redux/reducers/products';
import { Product } from '@/redux/reducers/products/types';
import { Avatar, Button, Col, Drawer, Row, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import CustomerEditor from '../customers/editor';
import {
  CircleDollarSign,
  MonitorCheck,
  MonitorX,
  PackagePlus,
  ShoppingBasket,
  UserRoundPlus,
} from 'lucide-react';
import useMediaQuery from '@/hooks/useMediaQueries';
import CashCutForm from '../cash_cuts/current-cash-cut/cash-cut-form';
import { useState } from 'react';
import OpenCashierModal from '../cash_cuts/current-cash-cut/open-cashier-modal/modal';
import { ModuleAccess } from '@/routes/module-access';
import BottomMenu from '@/components/organisms/bottom-menu';
import { appActions } from '@/redux/reducers/app';
import OnboardingTour from '@/components/organisms/onboarding-tour';

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isTablet } = useMediaQuery();
  const { current_customer } = useAppSelector(({ customers }) => customers);
  const { active_cash_cut } = useAppSelector(({ cashiers }) => cashiers);
  const { permissions } = useAppSelector(
    ({ users }) => users.user_auth.profile!,
  );
  const [openCloseCashier, setOpenCloseCashier] = useState(false);
  const [openCashierVisible, setOpenCashierVisible] = useState(false);

  const addProduct = () => {
    dispatch(productActions.setCurrentProduct({} as Product));
    navigate(APP_ROUTES.PRIVATE.PRODUCT_EDITOR.hash`${'add'}`);
  };

  const newSale = () => {
    navigate(APP_ROUTES.PRIVATE.CASH_REGISTER.MAIN.path);
  };

  const addCustomer = () => {
    dispatch(
      customerActions.setCurrentCustomer({ customer_id: -1 } as Customer),
    );
  };

  const onClose = () => {
    dispatch(customerActions.setCurrentCustomer({} as Customer));
  };

  const addExpense = () => {
    navigate(APP_ROUTES.PRIVATE.PURCHASES_EXPENSES.ADD_NEW.hash`${'expense'}`);
  };

  const handleDrawerVisible = () => {
    setOpenCloseCashier((prev) => !prev);
  };

  const handleOpenCashier = () => {
    setOpenCashierVisible((prev) => !prev);
  };

  return (
    <>
      <OnboardingTour />
      <div className="p-3 step-1">
        {permissions?.pos?.add_sale?.value ||
        permissions?.expenses?.add_expense?.value ||
        permissions?.cash_registers?.make_cash_cut?.value ||
        permissions?.cash_registers?.open_cash_cut?.value ? (
          <Typography.Title level={5} className="mb-3">
            Movimientos
          </Typography.Title>
        ) : null}
        <Row gutter={[10, 10]}>
          {permissions?.pos?.add_sale?.value && (
            <CardButton
              title="Nueva venta"
              description="Accede al punto de venta"
              icon={
                <ShoppingBasket
                  strokeWidth={1.5}
                  className="text-purple-600 !w-8 !h-8"
                />
              }
              className="bg-purple-600/10"
              onClick={newSale}
            />
          )}

          <ModuleAccess moduleName="expenses">
            {permissions?.expenses?.add_expense?.value && (
              <CardButton
                title="Registrar gasto"
                description="Registra un gasto"
                icon={
                  <CircleDollarSign
                    strokeWidth={1.8}
                    className="text-pink-600 !w-7 !h-7"
                  />
                }
                className="bg-pink-600/10"
                onClick={addExpense}
              />
            )}
          </ModuleAccess>

          <ModuleAccess moduleName="make_cash_cut">
            {(permissions?.cash_registers?.make_cash_cut?.value ||
              permissions?.cash_registers?.open_cash_cut?.value) && (
              <CardButton
                title={
                  active_cash_cut?.cash_cut_id
                    ? isTablet
                      ? 'Hacer corte de caja'
                      : 'Corte de caja'
                    : 'Abrir caja'
                }
                description={
                  active_cash_cut?.cash_cut_id
                    ? 'Realiza el corte de caja'
                    : 'Abre la caja registradora'
                }
                icon={
                  active_cash_cut?.cash_cut_id ? (
                    <MonitorX
                      strokeWidth={1.8}
                      className="text-teal-600 !w-7 !h-7"
                    />
                  ) : (
                    <MonitorCheck
                      strokeWidth={1.8}
                      className="text-teal-600 !w-7 !h-7"
                    />
                  )
                }
                className="bg-teal-600/10"
                onClick={() => {
                  if (active_cash_cut?.cash_cut_id) {
                    handleDrawerVisible();
                  } else {
                    handleOpenCashier();
                  }
                }}
              />
            )}
          </ModuleAccess>
        </Row>

        {permissions?.products?.add_product?.value ||
        permissions?.customers?.add_customer?.value ? (
          <Typography.Title level={5} className="mt-5 mb-3">
            Agregar nuevo
          </Typography.Title>
        ) : null}
        <Row gutter={[10, 10]}>
          {permissions?.products?.add_product?.value && (
            <CardButton
              title="Nuevo producto"
              description="Agregar un producto al catalogo"
              icon={
                <PackagePlus
                  strokeWidth={1.5}
                  className="text-green-600 !w-8 !h-8"
                />
              }
              className="bg-green-600/10"
              onClick={addProduct}
            />
          )}

          {permissions?.customers?.add_customer?.value && (
            <CardButton
              title="Nuevo cliente"
              description="Crea un nuevo cliente"
              icon={
                <UserRoundPlus
                  strokeWidth={1.8}
                  className="text-sky-600 !w-7 !h-7 -mr-1"
                />
              }
              className="bg-sky-600/10"
              onClick={addCustomer}
            />
          )}

          <Drawer
            title={
              current_customer.customer_id !== -1
                ? 'Editar cliente'
                : 'Agregar nuevo cliente'
            }
            width={420}
            onClose={onClose}
            open={!!current_customer.customer_id}
            styles={{ body: { paddingBottom: 80 } }}
          >
            <CustomerEditor />
          </Drawer>

          <CashCutForm
            visible={openCloseCashier}
            onClose={handleDrawerVisible}
            fetchOnOpen
          />
          <OpenCashierModal
            visible={openCashierVisible}
            onClose={handleOpenCashier}
          />
        </Row>
      </div>
      {isTablet && <BottomMenu />}
    </>
  );
};

type CardButtonProps = {
  id?: string;
  icon?: JSX.Element;
  title?: string;
  description?: string;
  className?: string;
  rootClassName?: string;
  onClick?: React.MouseEventHandler<HTMLDivElement> | undefined;
};

export const CardButton = ({
  id,
  description,
  icon,
  title,
  onClick,
  className,
  rootClassName = '',
}: CardButtonProps) => {
  return (
    <Col lg={8} sm={12} xs={12} xxl={6} className={rootClassName}>
      <div
        id={id}
        className="flex flex-col border sm:flex-row gap-2 sm:gap-4 items-center w-full rounded-lg px-4 h-auto py-3 sm:py-1 sm:h-20 bg-white cursor-pointer hover:shadow-md"
        onClick={onClick}
      >
        <Avatar
          icon={icon}
          className={`${className} h-14 w-14 min-w-14 min-h-14`}
        />
        <div className="flex flex-col">
          <h5 className="font-semibold">{title}</h5>
          <p className="text-xs font-light text-slate-400 leading-[1.3] hidden sm:inline-flex">
            {description}
          </p>
        </div>
      </div>
    </Col>
  );
};

export default Dashboard;
