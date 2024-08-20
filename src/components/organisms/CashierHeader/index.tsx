import { Button, Dropdown, Typography, Avatar } from 'antd';
import { HeaderActions, HeaderRoot } from './styles';
import {
  DollarCircleOutlined,
  HomeOutlined,
  InboxOutlined,
  MenuOutlined,
  SettingOutlined,
  ShopOutlined,
  ShoppingOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { APP_ROUTES } from '@/routes/routes';
import { useState } from 'react';
import { useAppSelector } from '@/hooks/useStore';
import ChangeBranchModal from './change-branch-modal';

const CashierHeader = () => {
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const { currentBranch, currentCashRegister } = useAppSelector(({ branches }) => branches);
  const { permissions } = useAppSelector(({ users }) => users.user_auth.profile!);

  const onNavigate = (path: string) => {
    navigate(path);
  };

  const handleOpen = () => {
    setOpen(prev => !prev);
  };

  return (
    <HeaderRoot className="border-b border-gray-300 px-3">
      <div className="flex items-center">
        <Dropdown
          menu={{
            items: [
              {
                key: 'home',
                label: (
                  <div className="flex gap-4 w-40 items-center py-1">
                    <HomeOutlined className="text-lg" />
                    <Typography.Text className="!text-base">Inicio</Typography.Text>
                  </div>
                ),
                onClick: () => onNavigate(APP_ROUTES.PRIVATE.HOME.path),
              },

              !!permissions?.products?.show_in_catalog
                ? {
                    key: 'products',
                    label: (
                      <div className="flex gap-4 w-40 items-center py-1">
                        <ShoppingOutlined className="text-lg" />
                        <Typography.Text className="!text-base">Productos</Typography.Text>
                      </div>
                    ),
                    onClick: () => onNavigate(APP_ROUTES.PRIVATE.PRODUCTS.path),
                  }
                : null,
              permissions?.sales?.view_sales
                ? {
                    key: 'sales',
                    label: (
                      <div className="flex gap-4 w-40 items-center py-1">
                        <DollarCircleOutlined className="text-lg" />
                        <Typography.Text className="!text-base">Ventas</Typography.Text>
                      </div>
                    ),
                    onClick: () => onNavigate(APP_ROUTES.PRIVATE.SALES.path),
                  }
                : null,
              permissions?.customers?.view_customers
                ? {
                    key: 'customers',
                    label: (
                      <div className="flex gap-4 w-40 items-center py-1">
                        <TeamOutlined className="text-lg" />
                        <Typography.Text className="!text-base">Clientes</Typography.Text>
                      </div>
                    ),
                    onClick: () => onNavigate(APP_ROUTES.PRIVATE.CUSTOMERS.path),
                  }
                : null,
              permissions?.cash_registers?.view_current_cash_cut
                ? {
                    key: 'current_cash_cut',
                    label: (
                      <div className="flex gap-4 w-40 items-center py-1">
                        <InboxOutlined className="text-lg" />
                        <Typography.Text className="!text-base">Caja actual</Typography.Text>
                      </div>
                    ),
                    onClick: () => onNavigate(APP_ROUTES.PRIVATE.TRANSACTIONS.CURRENT_CASHIER.path),
                  }
                : null,
              {
                key: 'settings',
                label: (
                  <div className="flex gap-4 w-40 items-center py-1">
                    <SettingOutlined className="text-lg" />
                    <Typography.Text className="!text-base">Configuración</Typography.Text>
                  </div>
                ),
                onClick: () => onNavigate(APP_ROUTES.PRIVATE.SETTINGS.path),
              },
            ],
          }}
        >
          <div className="flex">
            <Button icon={<MenuOutlined className="text-2xl font-light" />} size="large" />
          </div>
        </Dropdown>
      </div>

      <HeaderActions>
        <div
          onClick={handleOpen}
          className="flex gap-4 min-w-44 items-center hover:bg-slate-50 py-1 pl-3 pr-4 rounded-lg border border-transparent cursor-pointer hover:border-primary/30 "
        >
          <Avatar
            shape="square"
            size={40}
            className={'bg-primary/10'}
            icon={<ShopOutlined className="text-primary text-2xl font-light" />}
          />
          <div className="flex flex-col">
            <Typography.Title className="avatar-title m-0 !text-sm leading-tight !font-medium capitalize" level={5}>
              Sucursal {currentBranch?.name || 'Principal'}
            </Typography.Title>
            <Typography.Text className="leading-tight capitalize font-light" type="secondary">
              Caja {currentCashRegister?.name}
            </Typography.Text>
          </div>
        </div>
      </HeaderActions>
      <ChangeBranchModal onCancel={handleOpen} open={open} />
    </HeaderRoot>
  );
};

export default CashierHeader;
