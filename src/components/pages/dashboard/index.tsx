import { APP_ROUTES } from '@/constants/routes';
import { useAppDispatch, useAppSelector } from '@/hooks/useStore';
import { customerActions } from '@/redux/reducers/customers';
import { Customer } from '@/redux/reducers/customers/types';
import { productActions } from '@/redux/reducers/products';
import { Product } from '@/redux/reducers/products/types';
import { AppstoreAddOutlined, ShoppingCartOutlined, UserAddOutlined } from '@ant-design/icons';
import { Avatar, Card, Col, Drawer, Row } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useTheme } from 'styled-components';
import CustomerEditor from '../customers/editor';

const Dashboard = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { current_customer } = useAppSelector(({ customers }) => customers);

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
    <Row gutter={[10, 10]}>
      <CardButton
        title="Nuevo producto"
        description="Agregar un producto al catalogo"
        icon={<AppstoreAddOutlined rev={{}} />}
        onClick={addProduct}
      />
      <CardButton
        title="Nuevo cliente"
        description="Crea un nuevo cliente"
        icon={<UserAddOutlined rev={{}} />}
        onClick={addCustomer}
      />
      <CardButton
        title="Punto de venta"
        description="Accede al punto de venta"
        icon={<ShoppingCartOutlined rev={{}} />}
        onClick={newSale}
      />

      <Drawer
        title={current_customer.customer_id !== -1 ? 'Editar cliente' : 'Agregar nuevo cliente'}
        width={420}
        onClose={onClose}
        open={!!current_customer.customer_id}
        bodyStyle={{ paddingBottom: 80 }}
      >
        <CustomerEditor />
      </Drawer>
    </Row>
  );
};

type CardButtonProps = {
  icon?: JSX.Element;
  title?: string;
  description?: string;
  color?: string;
  onClick?: React.MouseEventHandler<HTMLDivElement> | undefined;
};
const CardButton = ({ description, icon, title, onClick, color }: CardButtonProps) => {
  const theme = useTheme();
  return (
    <Col lg={8}>
      <Card hoverable onClick={onClick}>
        <Card.Meta
          avatar={<Avatar icon={icon} style={{ background: color || theme.colors.primary }} size={60} />}
          title={title}
          description={description}
        />
      </Card>
    </Col>
  );
};

export default Dashboard;
