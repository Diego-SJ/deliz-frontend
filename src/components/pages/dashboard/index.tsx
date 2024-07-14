import { APP_ROUTES } from '@/routes/routes';
import { useAppDispatch, useAppSelector } from '@/hooks/useStore';
import { customerActions } from '@/redux/reducers/customers';
import { Customer } from '@/redux/reducers/customers/types';
import { productActions } from '@/redux/reducers/products';
import { Product } from '@/redux/reducers/products/types';
import { AppstoreAddOutlined, ShoppingCartOutlined, UserAddOutlined } from '@ant-design/icons';
import { Avatar, Card, Col, Drawer, Row } from 'antd';
import { useNavigate } from 'react-router-dom';
import CustomerEditor from '../customers/editor';

const Dashboard = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { current_customer } = useAppSelector(({ customers }) => customers);
  const { user_auth } = useAppSelector(({ users }) => users);
  const isSales = user_auth?.profile?.role === 'SALES';

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

  const newOrder = () => {
    navigate(APP_ROUTES.PRIVATE.CASH_REGISTER.MAIN.path + '?mode=order');
  };

  return (
    <div className="p-3">
      <Row gutter={[10, 10]}>
        {!isSales && (
          <>
            <CardButton
              title="Nueva venta"
              description="Accede al punto de venta"
              icon={<ShoppingCartOutlined className="text-purple-600" />}
              className="bg-purple-600/10 shadow-md shadow-purple-600/40"
              onClick={newSale}
            />
            <CardButton
              title="Nuevo producto"
              description="Agregar un producto al catalogo"
              icon={<AppstoreAddOutlined className="text-green-600" />}
              className="bg-green-600/10 shadow-md shadow-green-600/40 "
              onClick={addProduct}
            />
          </>
        )}

        <CardButton
          title="Nuevo cliente"
          description="Crea un nuevo cliente"
          icon={<UserAddOutlined className="text-orange-600" />}
          className="bg-orange-600/10 shadow-md shadow-orange-600/40"
          onClick={addCustomer}
        />

        <CardButton
          title="Nuevo pedido"
          description="Accede al punto de venta para crear un pedido"
          icon={<ShoppingCartOutlined className="text-blue-600" />}
          className="bg-blue-600/10 shadow-md shadow-blue-600/40"
          onClick={newOrder}
        />

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
