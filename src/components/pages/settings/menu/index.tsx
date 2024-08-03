import { useAppSelector } from '@/hooks/useStore';
import { APP_ROUTES } from '@/routes/routes';
import {
  BankOutlined,
  DollarOutlined,
  GoldOutlined,
  InboxOutlined,
  LineHeightOutlined,
  ProductOutlined,
  SettingOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { Menu } from 'antd';
import { createElement } from 'react';
import { useNavigate } from 'react-router-dom';

const SettingsMenu = () => {
  const navigate = useNavigate();
  const { permissions, role } = useAppSelector(({ users }) => users.user_auth.profile!);
  const isAdmin = role === 'ADMIN';

  const handleRoute = (path: string) => {
    navigate(path);
  };

  return (
    <div className="w-full bg-white py-3 px-2 flex shadow-md h-[calc(100vh-64px)] items-center">
      <Menu
        className="w-full h-full bg-transparent shadow-md"
        style={{ borderInlineEnd: 'none' }}
        items={[
          {
            key: 1,
            icon: createElement(SettingOutlined),
            label: 'General',
            onClick: () => handleRoute(APP_ROUTES.PRIVATE.DASHBOARD.SETTINGS.path + '/general'),
          },
          permissions?.branches?.view_branches
            ? {
                key: 7,
                icon: createElement(BankOutlined),
                label: 'Sucursales',
                onClick: () => handleRoute(APP_ROUTES.PRIVATE.DASHBOARD.SETTINGS.BRANCHES.path),
              }
            : null,
          permissions?.cash_registers?.view_cash_registers
            ? {
                key: 2,
                icon: createElement(InboxOutlined),
                label: 'Cajas',
                onClick: () => handleRoute(APP_ROUTES.PRIVATE.DASHBOARD.SETTINGS.CASH_REGISTERS.path),
              }
            : null,
          permissions?.price_list?.view_price_list
            ? {
                key: 3,
                icon: createElement(DollarOutlined),
                label: 'Lista de precios',
                onClick: () => handleRoute(APP_ROUTES.PRIVATE.DASHBOARD.SETTINGS.PRICES_LIST.path),
              }
            : null,
          permissions?.categories?.view_categories
            ? {
                key: 4,
                icon: createElement(ProductOutlined),
                label: 'Categorías',
                onClick: () => handleRoute(APP_ROUTES.PRIVATE.DASHBOARD.SETTINGS.CATEGORIES.path),
              }
            : null,
          permissions?.sizes?.view_sizes
            ? {
                key: 5,
                icon: createElement(LineHeightOutlined),
                label: 'Tamaños',
                onClick: () => handleRoute(APP_ROUTES.PRIVATE.DASHBOARD.SETTINGS.SIZES.path),
              }
            : null,
          permissions?.units?.view_units
            ? {
                key: 6,
                icon: createElement(GoldOutlined),
                label: 'Unidades',
                onClick: () => handleRoute(APP_ROUTES.PRIVATE.DASHBOARD.SETTINGS.UNITS.path),
              }
            : null,
          isAdmin
            ? {
                key: 8,
                icon: createElement(TeamOutlined),
                label: 'Usuarios y permisos',
                onClick: () => handleRoute(APP_ROUTES.PRIVATE.DASHBOARD.SETTINGS.USERS.path),
              }
            : null,
        ].filter(Boolean)}
      />
    </div>
  );
};

export default SettingsMenu;
