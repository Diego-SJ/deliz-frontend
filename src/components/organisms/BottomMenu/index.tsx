import { BottomMenuRoot } from './styles';
import { Button, Tooltip } from 'antd';
import { BarcodeOutlined, ShoppingCartOutlined, HomeOutlined, UserOutlined } from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import { APP_ROUTES } from '@/routes/routes';

const BottomMenu = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const onClick = (path: string) => {
    navigate(path);
  };

  return (
    <BottomMenuRoot>
      <Tooltip title="Inicio">
        <Button
          className={`${pathname === APP_ROUTES.AUTH.MAIN.path ? 'active' : ''}`}
          size="large"
          shape="round"
          icon={<HomeOutlined />}
          type="text"
          onClick={() => onClick(APP_ROUTES.AUTH.MAIN.path)}
        />
      </Tooltip>
      <Tooltip title="Productos">
        <Button
          className={`${pathname.includes(APP_ROUTES.PUBLIC.PRODUCTS.path) ? 'active' : ''}`}
          size="large"
          shape="round"
          icon={<BarcodeOutlined />}
          type="text"
          onClick={() => onClick(APP_ROUTES.PUBLIC.PRODUCTS.path)}
        />
      </Tooltip>
      <Tooltip title="Carrito">
        <Button size="large" shape="round" icon={<ShoppingCartOutlined />} type="text" />
      </Tooltip>
      <Tooltip title="Perfil">
        <Button size="large" shape="round" icon={<UserOutlined />} type="text" />
      </Tooltip>
    </BottomMenuRoot>
  );
};

export default BottomMenu;
