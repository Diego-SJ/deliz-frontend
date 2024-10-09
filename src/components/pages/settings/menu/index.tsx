import { ROLES } from '@/constants/roles';
import { useAppDispatch, useAppSelector } from '@/hooks/useStore';
import { userActions } from '@/redux/reducers/users';
import { APP_ROUTES } from '@/routes/routes';
import {
  BankOutlined,
  DollarOutlined,
  ExclamationCircleOutlined,
  GoldOutlined,
  InboxOutlined,
  LineHeightOutlined,
  LogoutOutlined,
  ProductOutlined,
  SettingOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { App, Button, Card, Menu } from 'antd';

import { createElement } from 'react';
import { useNavigate } from 'react-router-dom';

const SettingsMenu = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { modal } = App.useApp();
  const { permissions, role } = useAppSelector(
    ({ users }) => users.user_auth.profile!,
  );
  const isAdmin = role === ROLES.ADMIN;

  const handleRoute = (path: string) => {
    navigate(path);
  };

  const signOut = () => {
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

  return (
    <div className="flex flex-col w-full max-md:!bg-neutral-100 md:!bg-white py-3 px-4 md:px-2 shadow-sm h-[calc(100vh-64px)] md:items-center">
      <Menu
        className="w-full md:h-full bg-transparent shadow-sm max-md:!text-base max-md:rounded-xl max-md:py-3 max-md:h-fit max-md:bg-white"
        style={{ borderInlineEnd: 'none' }}
        items={[
          {
            key: 1,
            icon: createElement(SettingOutlined, {
              className: 'max-md:!text-lg',
            }),
            label: 'General',
            onClick: () =>
              handleRoute(APP_ROUTES.PRIVATE.SETTINGS.path + '/general'),
          },
          permissions?.branches?.view_branches?.value
            ? {
                key: 7,
                icon: createElement(BankOutlined, {
                  className: 'max-md:!text-lg',
                }),
                label: 'Sucursales',
                onClick: () =>
                  handleRoute(APP_ROUTES.PRIVATE.SETTINGS.BRANCHES.path),
              }
            : null,
          permissions?.cash_registers?.view_cash_registers?.value
            ? {
                key: 2,
                icon: createElement(InboxOutlined, {
                  className: 'max-md:!text-xl md:!text-base',
                }),
                label: 'Cajas',
                onClick: () =>
                  handleRoute(APP_ROUTES.PRIVATE.SETTINGS.CASH_REGISTERS.path),
              }
            : null,
          permissions?.price_list?.view_price_list?.value
            ? {
                key: 3,
                icon: createElement(DollarOutlined, {
                  className: 'max-md:!text-lg',
                }),
                label: 'Lista de precios',
                onClick: () =>
                  handleRoute(APP_ROUTES.PRIVATE.SETTINGS.PRICES_LIST.path),
              }
            : null,
          permissions?.categories?.view_categories?.value
            ? {
                key: 4,
                icon: createElement(ProductOutlined, {
                  className: 'max-md:!text-lg',
                }),
                label: 'Categorías',
                onClick: () =>
                  handleRoute(APP_ROUTES.PRIVATE.SETTINGS.CATEGORIES.path),
              }
            : null,
          permissions?.sizes?.view_sizes?.value
            ? {
                key: 5,
                icon: createElement(LineHeightOutlined, {
                  className: 'max-md:!text-lg',
                }),
                label: 'Tamaños',
                onClick: () =>
                  handleRoute(APP_ROUTES.PRIVATE.SETTINGS.SIZES.path),
              }
            : null,
          permissions?.units?.view_units?.value
            ? {
                key: 6,
                icon: createElement(GoldOutlined, {
                  className: 'max-md:!text-lg',
                }),
                label: 'Unidades',
                onClick: () =>
                  handleRoute(APP_ROUTES.PRIVATE.SETTINGS.UNITS.path),
              }
            : null,
          isAdmin
            ? {
                key: 8,
                icon: createElement(TeamOutlined, {
                  className: 'max-md:!text-lg',
                }),
                label: 'Usuarios y permisos',
                onClick: () =>
                  handleRoute(APP_ROUTES.PRIVATE.SETTINGS.USERS.path),
              }
            : null,
        ].filter(Boolean)}
      />

      <Card className="block md:hidden mt-10">
        <Button
          danger
          type="primary"
          icon={<LogoutOutlined />}
          block
          onClick={signOut}
        >
          Cerrar sesión
        </Button>
      </Card>
    </div>
  );
};

export default SettingsMenu;
