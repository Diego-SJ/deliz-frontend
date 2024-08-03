import { APP_ROUTES } from '@/routes/routes';
import { useAppDispatch, useAppSelector } from '@/hooks/useStore';
import { customerActions } from '@/redux/reducers/customers';
import { Customer } from '@/redux/reducers/customers/types';
import { productActions } from '@/redux/reducers/products';
import { Product } from '@/redux/reducers/products/types';
import { Avatar, Card, Col, Drawer, Row } from 'antd';
import { useNavigate } from 'react-router-dom';
import CustomerEditor from '../customers/editor';
import { PackagePlus, ShoppingBasket, UserRoundPlus } from 'lucide-react';

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

  return (
    <div className="p-3">
      <Row gutter={[10, 10]}>
        {permissions?.sales?.add_sale && (
          <CardButton
            title="Nueva venta"
            description="Accede al punto de venta"
            icon={<ShoppingBasket strokeWidth={1.5} className="text-purple-600 !w-8 !h-8" />}
            className="bg-purple-600/10 shadow-md shadow-purple-600/40"
            onClick={newSale}
          />
        )}

        {permissions?.products?.add_product && (
          <CardButton
            title="Nuevo producto"
            description="Agregar un producto al catalogo"
            icon={<PackagePlus strokeWidth={1.5} className="text-green-600 !w-8 !h-8" />}
            className="bg-green-600/10 shadow-md shadow-green-600/40 "
            onClick={addProduct}
          />
        )}

        {permissions?.customers?.add_customer && (
          <CardButton
            title="Nuevo cliente"
            description="Crea un nuevo cliente"
            icon={<UserRoundPlus strokeWidth={1.8} className="text-orange-600 !w-7 !h-7 -mr-1" />}
            className="bg-orange-600/10 shadow-md shadow-orange-600/40"
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
    <Col lg={8} sm={12} xs={24} xxl={6}>
      <Card hoverable onClick={onClick}>
        <Card.Meta avatar={<Avatar icon={icon} className={className} size={60} />} title={title} description={description} />
      </Card>
    </Col>
  );
};

export default Dashboard;
