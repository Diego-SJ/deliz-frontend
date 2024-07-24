import { Button, Dropdown, Modal, Typography, Avatar } from 'antd';
import { HeaderActions, HeaderRoot } from './styles';
import {
  DollarCircleOutlined,
  HomeOutlined,
  MenuOutlined,
  ShopOutlined,
  ShoppingOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { APP_ROUTES } from '@/routes/routes';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/useStore';
import { branchesActions } from '@/redux/reducers/branches';
import { Branch } from '@/redux/reducers/branches/type';

const CashierHeader = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [open, setOpen] = useState(false);
  const { currentBranch, branches } = useAppSelector(({ branches }) => branches);
  const { cashiers } = useAppSelector(({ sales }) => sales);

  const onNavigate = (path: string) => {
    navigate(path);
  };

  const handleOpen = () => {
    setOpen(prev => !prev);
  };

  const handleBranchChange = (branch: Branch) => {
    handleOpen();
    dispatch(branchesActions.setCurrentBranch(branch as Branch));
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
                onClick: () => onNavigate(APP_ROUTES.PRIVATE.DASHBOARD.HOME.path),
              },
              {
                key: 'products',
                label: (
                  <div className="flex gap-4 w-40 items-center py-1">
                    <ShoppingOutlined className="text-lg" />
                    <Typography.Text className="!text-base">Productos</Typography.Text>
                  </div>
                ),
                onClick: () => onNavigate(APP_ROUTES.PRIVATE.DASHBOARD.PRODUCTS.path),
              },
              {
                key: 'sales',
                label: (
                  <div className="flex gap-4 w-40 items-center py-1">
                    <DollarCircleOutlined className="text-lg" />
                    <Typography.Text className="!text-base">Ventas</Typography.Text>
                  </div>
                ),
                onClick: () => onNavigate(APP_ROUTES.PRIVATE.DASHBOARD.SALES.path),
              },
              {
                key: 'customers',
                label: (
                  <div className="flex gap-4 w-40 items-center py-1">
                    <TeamOutlined className="text-lg" />
                    <Typography.Text className="!text-base">Clientes</Typography.Text>
                  </div>
                ),
                onClick: () => onNavigate(APP_ROUTES.PRIVATE.DASHBOARD.CUSTOMERS.path),
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
              Caja: {cashiers?.activeCashier?.name}
            </Typography.Text>
          </div>
        </div>
      </HeaderActions>
      <Modal
        open={open}
        width={400}
        title={<Typography.Title level={4}>Selecciona una sucursal</Typography.Title>}
        onCancel={handleOpen}
        footer={null}
      >
        <Typography.Paragraph className="text-sm font-light" style={{ marginBottom: 20 }}>
          Selecciona una sucursal para continuar
        </Typography.Paragraph>

        {branches.map(item => (
          <div
            key={item.branch_id}
            onClick={() => {
              handleBranchChange(item);
              setOpen(false);
            }}
            className={`flex items-center px-2 py-2 gap-3 hover:bg-gray-50 cursor-pointer border rounded-lg mt-2 mb-2 ${
              item?.branch_id === currentBranch?.branch_id ? 'bg-blue-600/5' : ''
            }`}
          >
            <Avatar shape="square" size="large" icon={<ShopOutlined className="text-blue-600" />} className="bg-blue-600/10" />
            <div className="flex flex-col">{item.name}</div>
          </div>
        ))}
      </Modal>
    </HeaderRoot>
  );
};

export default CashierHeader;
