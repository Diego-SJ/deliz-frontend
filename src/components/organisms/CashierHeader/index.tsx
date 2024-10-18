import { Button, Dropdown, Typography, Avatar } from 'antd';
import { HeaderActions, HeaderRoot } from './styles';
import {
  DollarCircleOutlined,
  HomeOutlined,
  InboxOutlined,
  MenuOutlined,
  SettingOutlined,
  ShoppingOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { APP_ROUTES } from '@/routes/routes';
import { useState } from 'react';
import { useAppSelector } from '@/hooks/useStore';
import ChangeBranchModal from './change-branch-modal';
import { useMembershipAccess } from '@/routes/module-access';
import PrinterButton from '@/components/atoms/printer-btn';
import { Store } from 'lucide-react';
import useDeviceInfo from '@/feature-flags/useDeviceInfo';

const CashierHeader = () => {
  const navigate = useNavigate();
  const { hasAccess } = useMembershipAccess();
  const [open, setOpen] = useState(false);
  const { currentBranch, currentCashRegister } = useAppSelector(({ branches }) => branches);
  const { permissions } = useAppSelector(({ users }) => users.user_auth.profile!);
  const { isDesktop, browserName } = useDeviceInfo();

  const onNavigate = (path: string) => {
    navigate(path);
  };

  const handleOpen = () => {
    setOpen((prev) => !prev);
  };

  return (
    <HeaderRoot className="border-b border-gray-300 px-3">
      <div className="flex items-center gap-5">
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

              !!permissions?.products?.view_catalog?.value
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
              permissions?.sales?.view_sales?.value
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
              permissions?.customers?.view_customers?.value
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
              permissions?.cash_registers?.view_current_cash_cut?.value && hasAccess('make_cash_cut')
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
        {isDesktop && browserName === 'Chrome' && <PrinterButton />}
      </div>
      <div
        onClick={handleOpen}
        className="flex gap-4 min-w-fit items-center hover:bg-slate-50 py-1 pl-1 pr-2 rounded-lg border border-transparent cursor-pointer hover:border-primary/30 "
      >
        <Avatar
          shape="square"
          size={40}
          className={'bg-primary/10 min-w-10'}
          icon={<Store className="text-primary text-2xl font-light" />}
        />
        <div className="flex flex-col min-w-fit">
          <Typography.Title className="avatar-title !m-0 !text-sm leading-tight !font-medium capitalize" level={5}>
            Sucursal {currentBranch?.name || 'Principal'}
          </Typography.Title>
          <Typography.Text className="leading-tight capitalize font-light" type="secondary">
            Caja {currentCashRegister?.name}
          </Typography.Text>
        </div>
      </div>
      <ChangeBranchModal onCancel={handleOpen} open={open} />
    </HeaderRoot>
  );
};

export default CashierHeader;
