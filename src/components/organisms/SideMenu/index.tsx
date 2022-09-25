import {
  BarChartOutlined,
  HomeOutlined,
  LogoutOutlined,
  SettingOutlined,
  ShoppingCartOutlined,
  ShoppingOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { APP_ROUTES } from '@/constants/routes';
import { MenuRoot } from './styles';
import Logo from '@/components/molecules/Logo';

const SideMenu = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate(APP_ROUTES.AUTH.SIGN_IN.path);
  };

  const handlePathChange = (path: string) => {
    navigate(path);
  };

  return (
    <>
      <Logo src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg" title="My Business" />
      <MenuRoot
        defaultSelectedKeys={['1']}
        items={[
          {
            key: 1,
            icon: React.createElement(HomeOutlined),
            label: 'Dashboard',
            onClick: () => handlePathChange(APP_ROUTES.PRIVATE.DASHBOARD.HOME.path),
          },
          {
            key: 2,
            icon: React.createElement(ShoppingOutlined),
            label: 'Productos',
            onClick: () => handlePathChange(APP_ROUTES.PRIVATE.DASHBOARD.PRODUCTS.path),
          },
          {
            key: 3,
            icon: React.createElement(TeamOutlined),
            label: 'Clientes',
            onClick: () => handlePathChange(APP_ROUTES.PRIVATE.DASHBOARD.CUSTOMERS.path),
          },
          {
            key: 4,
            icon: React.createElement(ShoppingCartOutlined),
            label: 'Ordenes',
            onClick: () => handlePathChange(APP_ROUTES.PRIVATE.DASHBOARD.ORDERS.path),
          },
          {
            key: 5,
            icon: React.createElement(BarChartOutlined),
            label: 'Reportes',
            onClick: () => handlePathChange(APP_ROUTES.PRIVATE.DASHBOARD.REPORTS.path),
          },
          {
            key: 6,
            icon: React.createElement(SettingOutlined),
            label: 'Configuración',
            onClick: () => handlePathChange(APP_ROUTES.PRIVATE.DASHBOARD.SETTINGS.path),
          },
        ]}
      />
      <MenuRoot
        className="bottom"
        items={[
          {
            key: 1,
            icon: React.createElement(LogoutOutlined),
            label: 'Cerrar sesión',
            onClick: handleLogout,
          },
        ]}
      />
    </>
  );
};

export default SideMenu;
