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
import { MenuProps } from 'antd';
import { MenuRoot } from './styles';
import Logo from '@/components/molecules/Logo';
import { useNavigate } from 'react-router-dom';
import { APP_ROUTES } from '@/constants/routes';

const items: MenuProps['items'] = [
  { key: 1, icon: React.createElement(HomeOutlined), label: 'Dashboard' },
  { key: 2, icon: React.createElement(ShoppingOutlined), label: 'Productos' },
  { key: 3, icon: React.createElement(TeamOutlined), label: 'Clientes' },
  { key: 4, icon: React.createElement(ShoppingCartOutlined), label: 'Ordenes' },
  { key: 5, icon: React.createElement(BarChartOutlined), label: 'Reportes' },
  { key: 6, icon: React.createElement(SettingOutlined), label: 'Configuración' },
];

const SideMenu = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate(APP_ROUTES.AUTH.SIGN_IN);
  };

  return (
    <>
      <Logo
        src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg"
        title="My Business"
      />
      <MenuRoot defaultSelectedKeys={['1']} items={items} />
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
