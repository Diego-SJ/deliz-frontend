import {
  HomeOutlined,
  LogoutOutlined,
  DollarOutlined,
  ShoppingOutlined,
  TeamOutlined,
  ExclamationCircleOutlined,
  SettingOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { APP_ROUTES } from '@/routes/routes';
import { MenuRoot } from './styles';
import Logo from '@/components/molecules/Logo';
import DelizLogo from '@/assets/img/webp/deliz-logo-bn.webp';
import { Button, Modal, Tooltip } from 'antd';
import { useAppDispatch, useAppSelector } from '@/hooks/useStore';
import { userActions } from '@/redux/reducers/users';
import useMediaQuery from '@/hooks/useMediaQueries';
import CashRegisterSvg from '@/assets/img/jsx/cashier-menu';
import { Profile } from '@/redux/reducers/users/types';

type SideMenuProps = {
  onClick?: (args?: any) => void;
};

const ITEM_LIST = (permissions: Profile['permissions']) => [
  {
    key: 'dashboard',
    icon: HomeOutlined,
    label: 'Inicio',
    path: APP_ROUTES.PRIVATE.DASHBOARD.HOME.path,
  },
  permissions?.products?.view_catalog
    ? {
        key: 'products',
        icon: ShoppingOutlined,
        label: 'Productos',
        path: APP_ROUTES.PRIVATE.DASHBOARD.PRODUCTS.path,
      }
    : null,
  permissions?.customers?.view_customers
    ? {
        key: 'customers',
        icon: TeamOutlined,
        label: 'Clientes',
        path: APP_ROUTES.PRIVATE.DASHBOARD.CUSTOMERS.path,
      }
    : null,
  permissions?.sales?.view_sales
    ? {
        key: 'sales',
        icon: DollarOutlined,
        label: 'Ventas',
        path: APP_ROUTES.PRIVATE.DASHBOARD.SALES.path,
      }
    : null,
  permissions?.cash_registers?.view_current_cash_cut || permissions?.cash_registers?.view_history_cash_cuts
    ? {
        key: 'cashiers',
        icon: CashRegisterSvg,
        label: 'Cajas',
        children: [
          permissions?.cash_registers?.view_current_cash_cut
            ? {
                key: 'transactions.current_cashier',
                label: 'Caja actual',
                path: APP_ROUTES.PRIVATE.DASHBOARD.TRANSACTIONS.CURRENT_CASHIER.path,
              }
            : null,
          permissions?.cash_registers?.view_history_cash_cuts
            ? {
                key: 'transactions.cashiers',
                label: 'Historial de cajas',
                path: APP_ROUTES.PRIVATE.DASHBOARD.TRANSACTIONS.CASHIERS.path,
              }
            : null,
        ].filter(Boolean),
      }
    : null,
  // {
  //   key: 'expenses',
  //   icon: BarChartOutlined,
  //   label: 'Compras y Gastos',
  //   children: [
  //     {
  //       key: 'expenses.expenses',
  //       label: 'Gastos',
  //       path: APP_ROUTES.PRIVATE.DASHBOARD.TRANSACTIONS.CURRENT_CASHIER.path,
  //     },
  //     {
  //       key: 'expenses.purchases',
  //       label: 'Compras',
  //       path: APP_ROUTES.PRIVATE.DASHBOARD.TRANSACTIONS.CASHIERS.path,
  //     },
  //   ],
  // },
  {
    key: 'settings',
    icon: SettingOutlined,
    label: 'Configuración',
    path: APP_ROUTES.PRIVATE.DASHBOARD.SETTINGS.GENERAL.path,
  },
];

const SideMenu = (props: SideMenuProps) => {
  const { isTablet, isPhablet } = useMediaQuery();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const location = useLocation();
  const { permissions } = useAppSelector(({ users }) => users.user_auth.profile!);
  const { company } = useAppSelector(({ app }) => app);
  const [modal, contextHolder] = Modal.useModal();

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

  const handlePathChange = (path: string) => {
    if (path) navigate(path);
    if (props?.onClick) props.onClick();
  };

  return (
    <>
      <Logo src={!!company?.logo_url ? company.logo_url : DelizLogo} title="D'eliz" />

      <div className="flex px-4 mt-10 mb-6">
        <Tooltip title={isPhablet && !isTablet ? 'Nueva venta' : ''} color="purple-inverse" overlayInnerStyle={{ fontSize: 12 }}>
          <Button
            size="large"
            className="w-full mx-auto bg-primary/40 border border-primary text-white/90 hover:!bg-primary/60 hover:!text-white"
            icon={<PlusCircleOutlined />}
            onClick={() => {
              handlePathChange(APP_ROUTES.PRIVATE.CASH_REGISTER.MAIN.path);
            }}
          >
            {isPhablet && !isTablet ? '' : 'Nueva venta'}
          </Button>
        </Tooltip>
      </div>

      <MenuRoot
        theme={'dark' as any}
        mode="inline"
        className="mb-10"
        inlineCollapsed={isPhablet && !isTablet}
        items={ITEM_LIST(permissions!)
          ?.filter(Boolean)
          .map((item: any, key: any) => ({
            key,
            icon: React.createElement(item?.icon),
            label: isPhablet && !isTablet ? '' : item?.label,
            className: location.pathname?.includes(item.path) ? 'ant-menu-item-selected' : '',
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
        inlineCollapsed={isPhablet && !isTablet}
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
