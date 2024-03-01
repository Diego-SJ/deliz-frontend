import {
  HomeOutlined,
  LogoutOutlined,
  DollarOutlined,
  ShoppingOutlined,
  TeamOutlined,
  ExclamationCircleOutlined,
  BarChartOutlined,
  BarcodeOutlined,
} from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { APP_ROUTES } from '@/routes/routes';
import { MenuRoot } from './styles';
import Logo from '@/components/molecules/Logo';
import DelizLogo from '@/assets/img/png/logo_deliz.webp';
import { Modal } from 'antd';
import { useAppDispatch } from '@/hooks/useStore';
import { userActions } from '@/redux/reducers/users';

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
    children: [
      {
        key: 'products.list',
        label: 'Productos',
        path: APP_ROUTES.PRIVATE.DASHBOARD.PRODUCTS.path,
      },
      {
        key: 'products.categories',
        label: 'Categorias',
        path: APP_ROUTES.PRIVATE.DASHBOARD.PRODUCTS.CATEGORIES.path,
      },
      {
        key: 'products.size',
        label: 'Tamaños',
        path: APP_ROUTES.PRIVATE.DASHBOARD.PRODUCTS.SIZES.path,
      },
      {
        key: 'products.units',
        label: 'Unidades de medida',
        path: APP_ROUTES.PRIVATE.DASHBOARD.PRODUCTS.UNITS.path,
      },
    ],
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
        path: APP_ROUTES.PRIVATE.DASHBOARD.SALES.path,
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
    label: 'Transacciones',
    children: [
      {
        key: 'transactions.cashiers',
        label: 'Cajas',
        path: APP_ROUTES.PRIVATE.DASHBOARD.TRANSACTIONS.CASHIERS.path,
      },
      {
        key: 'transactions.operative_expenses',
        label: 'Gastos operativos',
        path: APP_ROUTES.PRIVATE.DASHBOARD.TRANSACTIONS.OPERATING_EXPENSES.path,
      },
    ],
  },
];

const SideMenu = (props: SideMenuProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [currentKey, setCurrentKey] = useState(0);
  const [modal, contextHolder] = Modal.useModal();

  useEffect(() => {
    const key = ITEM_LIST.findIndex(item => {
      return location.pathname.includes(item?.path || '');
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

  const handlePathChange = (path?: string) => {
    if (path) navigate(path);
    if (props?.onClick) props.onClick();
  };

  return (
    <>
      <Logo src={DelizLogo} title="D'eliz" />
      <MenuRoot
        selectedKeys={[`${currentKey}`]}
        mode="inline"
        items={ITEM_LIST.map((item, key) => ({
          key,
          icon: React.createElement(item.icon),
          label: item.label,
          onClick: () => handlePathChange(item?.path),
          children: item?.children?.length
            ? item.children.map(subItem => ({
                ...subItem,
                onClick: () => navigate(subItem.path),
              }))
            : null,
        }))}
      />
      <MenuRoot
        className="bottom"
        mode="inline"
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
