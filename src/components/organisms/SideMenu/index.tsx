import {
  HomeOutlined,
  LogoutOutlined,
  DollarOutlined,
  ShoppingOutlined,
  TeamOutlined,
  ExclamationCircleOutlined,
  SettingOutlined,
  PlusCircleOutlined,
  ReconciliationOutlined,
  InboxOutlined,
  ClockCircleOutlined,
  BarChartOutlined,
  ReadOutlined,
} from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import { APP_ROUTES } from '@/routes/routes';
import { MenuRoot } from './styles';
import Logo from '@/components/molecules/Logo';
import LogoAppWhite from '@/assets/logo-color.svg';
import { Button, Modal, Tooltip } from 'antd';
import { useAppDispatch, useAppSelector } from '@/hooks/useStore';
import { userActions } from '@/redux/reducers/users';
import useMediaQuery from '@/hooks/useMediaQueries';
import CashRegisterSvg from '@/assets/img/jsx/cashier-menu';
import { Profile } from '@/redux/reducers/users/types';
import { createElement } from 'react';
import { APP_VERSION } from '@/constants/versions';
import MyMembershipCard from '../membership';

type SideMenuProps = {
  onClick?: (args?: any) => void;
};

export const ITEM_LIST = (permissions?: Profile['permissions']) => [
  {
    key: 'dashboard',
    icon: HomeOutlined,
    label: 'Inicio',
    path: APP_ROUTES.PRIVATE.HOME.path,
  },
  permissions?.products?.view_catalog
    ? {
        key: 'products',
        icon: ShoppingOutlined,
        label: 'Productos',
        path: APP_ROUTES.PRIVATE.PRODUCTS.path,
      }
    : null,
  permissions?.customers?.view_customers
    ? {
        key: 'customers',
        icon: TeamOutlined,
        label: 'Clientes',
        path: APP_ROUTES.PRIVATE.CUSTOMERS.path,
      }
    : null,
  permissions?.sales?.view_sales
    ? {
        key: 'sales',
        icon: DollarOutlined,
        label: 'Ventas',
        path: APP_ROUTES.PRIVATE.SALES.path,
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
                path: APP_ROUTES.PRIVATE.TRANSACTIONS.CURRENT_CASHIER.path,
                icon: InboxOutlined,
              }
            : null,
          permissions?.cash_registers?.view_history_cash_cuts
            ? {
                key: 'transactions.cashiers',
                label: 'Historial de cajas',
                path: APP_ROUTES.PRIVATE.TRANSACTIONS.CASHIERS.path,
                icon: ClockCircleOutlined,
              }
            : null,
        ].filter(Boolean),
      }
    : null,
  permissions?.expenses?.view_expenses
    ? {
        key: 'expenses',
        icon: ReconciliationOutlined,
        label: 'Gastos',
        path: APP_ROUTES.PRIVATE.PURCHASES_EXPENSES.path,
      }
    : null,
  !!Object.values(permissions?.reports || {}).some(item => item)
    ? {
        key: 'reports',
        icon: BarChartOutlined,
        label: 'Reportes',
        path: APP_ROUTES.PRIVATE.REPORTS.path,
      }
    : null,
  permissions?.online_store?.view_online_store
    ? {
        key: 'online_catalog',
        icon: ReadOutlined,
        label: 'Catálogo en línea',
        path: APP_ROUTES.PRIVATE.ONLINE_STORE.path,
      }
    : null,
  {
    key: 'settings',
    icon: SettingOutlined,
    label: 'Configuración',
    path: APP_ROUTES.PRIVATE.SETTINGS.GENERAL.path,
  },
];

const SideMenu = (props: SideMenuProps) => {
  const { isTablet, isPhablet } = useMediaQuery();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const location = useLocation();
  const { permissions } = useAppSelector(({ users }) => users?.user_auth?.profile!);
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
      <Logo src={company?.logo_url || LogoAppWhite} title="D'eliz" />

      <div className="flex md:px-4 mb-2 mt-5 w-full justify-center">
        <Tooltip title={isPhablet && !isTablet ? 'Nueva venta' : ''} color="purple-inverse" overlayInnerStyle={{ fontSize: 12 }}>
          <Button
            className="w-full"
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
        // theme={'dark' as any}
        mode="inline"
        className=""
        inlineCollapsed={isPhablet && !isTablet}
        items={ITEM_LIST(permissions)
          ?.filter(Boolean)
          .map((item: any, key: any) => ({
            key,
            icon: createElement(item?.icon),
            label: isPhablet && !isTablet ? '' : item?.label,
            className: location.pathname?.includes(item.path) ? 'ant-menu-item-selected' : '',
            onClick: () => handlePathChange(item?.path),
            children: item?.children?.length
              ? item.children.map((subItem: any) => {
                  return {
                    key: subItem.key,
                    label: subItem.label,
                    onClick: () => navigate(subItem.path),
                  };
                })
              : null,
          }))}
        style={{ borderInlineEnd: 'none' }}
      />

      <div className="absolute bottom-0 w-full">
        <div className="px-5">
          <MyMembershipCard />
        </div>
        <MenuRoot
          className=""
          mode="inline"
          style={{ borderInlineEnd: 'none' }}
          inlineCollapsed={isPhablet && !isTablet}
          items={[
            {
              key: 1,
              icon: createElement(LogoutOutlined),
              label: 'Cerrar sesión',
              onClick: handleLogout,
            },
          ]}
        />

        {!isTablet && !isPhablet && (
          <div className="w-full flex justify-center text-xs text-slate-400 font-light py-2">
            <p>Posiffy App</p>
            <span className="">v{APP_VERSION}</span>
          </div>
        )}
      </div>
      {contextHolder}
    </>
  );
};

export default SideMenu;
