import {
  HomeOutlined,
  LogoutOutlined,
  DollarOutlined,
  ShoppingOutlined,
  TeamOutlined,
  ExclamationCircleOutlined,
  BarChartOutlined,
  ExceptionOutlined,
} from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { APP_ROUTES } from '@/routes/routes';
import { MenuRoot } from './styles';
import Logo from '@/components/molecules/Logo';
import DelizLogo from '@/assets/img/png/Logo Color.png';
import { Modal } from 'antd';
import { useAppDispatch } from '@/hooks/useStore';
import { userActions } from '@/redux/reducers/users';

const ITEM_LIST = [
  {
    icon: HomeOutlined,
    label: 'Dashboard',
    path: APP_ROUTES.PRIVATE.DASHBOARD.HOME.path,
  },
  {
    icon: ShoppingOutlined,
    label: 'Productos',
    path: APP_ROUTES.PRIVATE.DASHBOARD.PRODUCTS.path,
  },
  {
    icon: TeamOutlined,
    label: 'Clientes',
    path: APP_ROUTES.PRIVATE.DASHBOARD.CUSTOMERS.path,
  },
  {
    icon: DollarOutlined,
    label: 'Ventas',

    path: APP_ROUTES.PRIVATE.DASHBOARD.SALES.path,
  },

  // {
  //   icon: ExceptionOutlined,
  //   label: 'Deudores',
  //   path: APP_ROUTES.PRIVATE.DASHBOARD.DEBTORS.path,
  // },
  {
    icon: BarChartOutlined,
    label: 'Cortes',
    path: APP_ROUTES.PRIVATE.DASHBOARD.CUT.path,
  },
  // {
  //   icon: SettingOutlined,
  //   label: 'Configuración',
  //   path:APP_ROUTES.PRIVATE.DASHBOARD.SETTINGS.path,
  // },
];

type SideMenuProps = {
  onClick?: () => void;
};

const SideMenu = (props: SideMenuProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [currentKey, setCurrentKey] = useState(0);
  const [modal, contextHolder] = Modal.useModal();

  useEffect(() => {
    const key = ITEM_LIST?.findIndex(item => {
      return location.pathname?.includes(item?.path);
    });
    setCurrentKey(key || 0);
  }, [location.pathname]);

  const handleLogout = () => {
    modal.confirm({
      title: 'Cerrar sesión',
      icon: <ExclamationCircleOutlined rev={{}} />,
      content: 'Tu sesión será finalizada ¿deseas continuar?',
      okText: 'Continuar',
      cancelText: 'Cancelar',
      onOk: async () => {
        await dispatch(userActions.signOut());
      },
    });
  };

  const handlePathChange = (path: string) => {
    navigate(path);
    if (props?.onClick) props.onClick();
  };

  return (
    <>
      <Logo src={DelizLogo} title="D'eliz" />
      <MenuRoot
        selectedKeys={[`${currentKey}`]}
        items={ITEM_LIST.map((item, key) => ({
          key,
          icon: React.createElement(item.icon),
          label: item.label,
          onClick: () => handlePathChange(item.path),
        }))}
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
      {contextHolder}
    </>
  );
};

export default SideMenu;
