import { APP_ROUTES } from '@/routes/routes';
import {
  BankOutlined,
  DollarOutlined,
  ExpandAltOutlined,
  InboxOutlined,
  LineHeightOutlined,
  MoneyCollectOutlined,
  ProductOutlined,
  SettingOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { Menu } from 'antd';
import { createElement } from 'react';
import { useNavigate } from 'react-router-dom';

const SettingsMenu = () => {
  const navigate = useNavigate();

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
            onClick: () => handleRoute(APP_ROUTES.PRIVATE.DASHBOARD.SETTINGS.GENERAL.path),
          },
          {
            key: 2,
            icon: createElement(BankOutlined),
            label: 'Sucursales',
            onClick: () => handleRoute(APP_ROUTES.PRIVATE.DASHBOARD.SETTINGS.BRANCHES.path),
          },
          {
            key: 3,
            icon: createElement(DollarOutlined),
            label: 'Lista de precios',
            onClick: () => handleRoute(APP_ROUTES.PRIVATE.DASHBOARD.SETTINGS.PRICES_LIST.path),
          },
          {
            key: 4,
            icon: createElement(ProductOutlined),
            label: 'Categorías',
            onClick: () => handleRoute(APP_ROUTES.PRIVATE.DASHBOARD.SETTINGS.CATEGORIES.path),
          },
          {
            key: 5,
            icon: createElement(LineHeightOutlined),
            label: 'Tamaños',
            onClick: () => handleRoute(APP_ROUTES.PRIVATE.DASHBOARD.SETTINGS.SIZES.path),
          },
          {
            key: 6,
            icon: createElement(InboxOutlined),
            label: 'Unidades',
            onClick: () => handleRoute(APP_ROUTES.PRIVATE.DASHBOARD.SETTINGS.UNITS.path),
          },
        ]}
      ></Menu>
    </div>
  );
};

export default SettingsMenu;
