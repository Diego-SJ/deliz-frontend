import { APP_ROUTES } from '@/routes/routes';
import { useAppDispatch, useAppSelector } from '@/hooks/useStore';
import { customerActions } from '@/redux/reducers/customers';
import { Customer } from '@/redux/reducers/customers/types';
import { productActions } from '@/redux/reducers/products';
import { Product } from '@/redux/reducers/products/types';
import { Avatar, Col, Drawer, Row } from 'antd';
import { useNavigate } from 'react-router-dom';
import CustomerEditor from '../customers/editor';
import { CircleDollarSign, PackagePlus, ShoppingBasket, UserRoundPlus } from 'lucide-react';

const Dashboard = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { current_customer } = useAppSelector(({ customers }) => customers);
  const { permissions } = useAppSelector(({ users }) => users.user_auth.profile!);

  const addProduct = () => {
    dispatch(productActions.setCurrentProduct({} as Product));
    navigate(APP_ROUTES.PRIVATE.DASHBOARD.PRODUCT_EDITOR.hash`${'add'}`);
  };

  const newSale = () => {
    navigate(APP_ROUTES.PRIVATE.CASH_REGISTER.MAIN.path);
  };

  const addCustomer = () => {
    dispatch(customerActions.setCurrentCustomer({ customer_id: -1 } as Customer));
  };

  const onClose = () => {
    dispatch(customerActions.setCurrentCustomer({} as Customer));
  };

  const addExpense = () => {
    navigate(APP_ROUTES.PRIVATE.DASHBOARD.PURCHASES_EXPENSES.ADD_NEW.hash`${'expense'}`);
  };

  return (
    <div className="p-3">
      <Row gutter={[10, 10]}>
        {permissions?.sales?.add_sale && (
          <CardButton
            title="Nueva venta"
            description="Accede al punto de venta"
            icon={<ShoppingBasket strokeWidth={1.5} className="text-purple-600 !w-8 !h-8" />}
            className="bg-purple-600/10"
            onClick={newSale}
          />
        )}

        {permissions?.expenses?.add_expense && (
          <CardButton
            title="Registrar gasto"
            description="Registra un gasto"
            icon={<CircleDollarSign strokeWidth={1.8} className="text-orange-600 !w-7 !h-7" />}
            className="bg-orange-600/10"
            onClick={addExpense}
          />
        )}

        {permissions?.products?.add_product && (
          <CardButton
            title="Nuevo producto"
            description="Agregar un producto al catalogo"
            icon={<PackagePlus strokeWidth={1.5} className="text-green-600 !w-8 !h-8" />}
            className="bg-green-600/10"
            onClick={addProduct}
          />
        )}

        {permissions?.customers?.add_customer && (
          <CardButton
            title="Nuevo cliente"
            description="Crea un nuevo cliente"
            icon={<UserRoundPlus strokeWidth={1.8} className="text-sky-600 !w-7 !h-7 -mr-1" />}
            className="bg-sky-600/10"
            onClick={addCustomer}
          />
        )}

        <Drawer
          title={current_customer.customer_id !== -1 ? 'Editar cliente' : 'Agregar nuevo cliente'}
          width={420}
          onClose={onClose}
          open={!!current_customer.customer_id}
          styles={{ body: { paddingBottom: 80 } }}
        >
          <CustomerEditor />
        </Drawer>
      </Row>
    </div>
  );
};

type CardButtonProps = {
  icon?: JSX.Element;
  title?: string;
  description?: string;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLDivElement> | undefined;
};

export const CardButton = ({ description, icon, title, onClick, className }: CardButtonProps) => {
  return (
    <Col lg={8} sm={12} xs={12} xxl={6}>
      <div
        className="flex flex-col border sm:flex-row gap-2 sm:gap-4 items-center w-full rounded-lg px-4 h-auto py-3 sm:py-1 sm:h-20 bg-white cursor-pointer hover:shadow-md"
        onClick={onClick}
      >
        <Avatar icon={icon} className={`${className} h-14 w-14 min-w-14 min-h-14`} />
        <div className="flex flex-col">
          <h5 className="font-semibold">{title}</h5>
          <p className="text-xs font-light text-slate-400 leading-[1.3] hidden sm:inline-flex">{description}</p>
        </div>
      </div>
    </Col>
  );
};

export default Dashboard;
