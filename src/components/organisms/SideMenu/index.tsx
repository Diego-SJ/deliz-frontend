import {
  HomeOutlined,
  LogoutOutlined,
  DollarOutlined,
  ShoppingOutlined,
  TeamOutlined,
  ExclamationCircleOutlined,
  BarChartOutlined,
  BarcodeOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { APP_ROUTES } from '@/routes/routes';
import { MenuRoot } from './styles';
import Logo from '@/components/molecules/Logo';
import DelizLogo from '@/assets/img/webp/deliz-logo-bn.webp';
import { Modal } from 'antd';
import { useAppDispatch, useAppSelector } from '@/hooks/useStore';
import { userActions } from '@/redux/reducers/users';
import useMediaQuery from '@/hooks/useMediaQueries';

type SideMenuProps = {
  onClick?: () => void;
};

const ITEM_LIST = [
  {
    key: 'dashboard',
    icon: HomeOutlined,
    label: 'Dashboard',
    path: APP_ROUTES.PRIVATE.DASHBOARD.HOME.path,
  },
  {
    key: 'point_of_sale',
    icon: BarcodeOutlined,
    label: 'Punto de venta',
    path: APP_ROUTES.PRIVATE.CASH_REGISTER.MAIN.path,
  },
  {
    key: 'products',
    icon: ShoppingOutlined,
    label: 'Productos',
    path: APP_ROUTES.PRIVATE.DASHBOARD.PRODUCTS.path,
  },
  {
    key: 'customers',
    icon: TeamOutlined,
    label: 'Clientes',
    path: APP_ROUTES.PRIVATE.DASHBOARD.CUSTOMERS.path,
  },
  {
    key: 'sales',
    icon: DollarOutlined,
    label: 'Ventas',
    children: [
      {
        key: 'sales.orders',
        label: 'Pedidos',
        path: APP_ROUTES.PRIVATE.DASHBOARD.ORDERS.path,
      },
      {
        key: 'sales.main',
        label: 'Ventas',
        path: APP_ROUTES.PRIVATE.DASHBOARD.SALES.path,
      },
    ],
  },
  {
    key: 'transactions',
    icon: BarChartOutlined,
    label: 'Cajas',
    children: [
      {
        key: 'transactions.current_cashier',
        label: 'Caja actual',
        path: APP_ROUTES.PRIVATE.DASHBOARD.TRANSACTIONS.CURRENT_CASHIER.path,
      },
      {
        key: 'transactions.cashiers',
        label: 'Cajas',
        path: APP_ROUTES.PRIVATE.DASHBOARD.TRANSACTIONS.CASHIERS.path,
      },
    ],
  },
  {
    key: 'settings',
    icon: SettingOutlined,
    label: 'Configuración',
    path: APP_ROUTES.PRIVATE.DASHBOARD.SETTINGS.GENERAL.path,
  },
];

const SALES_ACTIONS = [
  {
    key: 'dashboard',
    icon: HomeOutlined,
    label: 'Dashboard',
    path: APP_ROUTES.PRIVATE.DASHBOARD.HOME.path,
  },
  {
    key: 'customers',
    icon: TeamOutlined,
    label: 'Clientes',
    path: APP_ROUTES.PRIVATE.DASHBOARD.CUSTOMERS.path,
  },
  {
    key: 'sales',
    icon: DollarOutlined,
    label: 'Pedidos',
    path: APP_ROUTES.PRIVATE.DASHBOARD.ORDERS.path,
  },
];

const SideMenu = (props: SideMenuProps) => {
  const { isTablet, isPhablet } = useMediaQuery();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user_auth } = useAppSelector(({ users }) => users);
  const { business } = useAppSelector(({ app }) => app);
  const [modal, contextHolder] = Modal.useModal();
  const [currentItems, setCurrentItems] = useState<any[]>([]);
  const isSales = user_auth?.user?.email === 'sales@deliz.com';

  useEffect(() => {
    if (isSales) setCurrentItems(SALES_ACTIONS);
    else setCurrentItems(ITEM_LIST);
  }, [isSales]);

  const handleLogout = () => {
    modal.confirm({
      title: 'Cerrar sesión',
      icon: <ExclamationCircleOutlined />,
      content: 'Tu sesión será finalizada ¿deseas continuar?',
      okText: 'Continuar',
      cancelText: 'Cancelar',
      onOk: async () => {
        await dispatch(userActions.signOut());
      },
    });
  };

  const handlePathChange = (path?: string) => {
    if (path) navigate(path);
    if (props?.onClick) props.onClick();
  };

  return (
    <>
      <Logo src={!!business?.logo_url ? business.logo_url : DelizLogo} title="D'eliz" />
      <MenuRoot
        theme={'dark' as any}
        mode="inline"
        inlineCollapsed={isPhablet && !isTablet}
        items={currentItems.map((item, key) => ({
          key,
          icon: React.createElement(item.icon),
          label: item.label,
          onClick: () => handlePathChange(item?.path),
          children: item?.children?.length
            ? item.children.map((subItem: any) => ({
                ...subItem,
                onClick: () => navigate(subItem.path),
              }))
            : null,
        }))}
        style={{ borderInlineEnd: 'none' }}
      />
      <MenuRoot
        className="bottom"
        mode="inline"
        theme={'dark' as any}
        style={{ borderInlineEnd: 'none' }}
        inlineCollapsed={isPhablet}
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
