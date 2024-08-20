import Popover from '@/components/atoms/Popover';
import { CaretDownOutlined, ExclamationCircleOutlined, LogoutOutlined, SettingOutlined, SyncOutlined } from '@ant-design/icons';
import { Modal, Typography } from 'antd';
import { useTheme } from 'styled-components';
import { useAppDispatch, useAppSelector } from '@/hooks/useStore';
import { userActions } from '@/redux/reducers/users';
import Avatar from '../Avatar';
import { useState } from 'react';
import ChangeBranchModal from '@/components/organisms/CashierHeader/change-branch-modal';

const MenuPopover = () => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const { user_auth } = useAppSelector(({ users }) => users);
  const { currentBranch, currentCashRegister } = useAppSelector(({ branches }) => branches);
  const [modal, contextHolder] = Modal.useModal();
  const [open, setOpen] = useState(false);

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

  const handleOpen = () => {
    setOpen(prev => !prev);
  };

  return (
    <>
      <Popover
        triggerComponent={
          <div className="flex gap-3 items-center border border-transparent cursor-pointer px-2 py-1 rounded-lg hover:border-slate-200">
            <Avatar title={`Sucursal ${currentBranch?.name}`} subtitle={`Caja ${currentCashRegister?.name}`} bordered />
            <CaretDownOutlined style={{ fontSize: 14, color: theme.colors.primary }} />
          </div>
        }
        placement="bottomRight"
        trigger="click"
        nopadding
      >
        <div className="pb-1 overflow-hidden rounded-t-lg min-w-[200px]">
          <div className="flex gap-3 px-4 py-2 bg-gray-100">
            <Typography.Text className="!text-sm text"> {user_auth?.profile?.email}</Typography.Text>
          </div>

          <div className="flex gap-3 px-4 py-2 hover:bg-slate-100 cursor-pointer" onClick={handleOpen}>
            <SyncOutlined className="!text-base" />
            <Typography.Text className="!text-sm text">Cambiar Caja o Sucursal</Typography.Text>
          </div>
          <div className="flex gap-3 px-4 py-2 hover:bg-slate-100 cursor-pointer">
            <SettingOutlined className="!text-base" />
            <Typography.Text className="!text-sm text">Configuración</Typography.Text>
          </div>
          <div className="flex gap-3 px-4 py-2 hover:bg-slate-100 cursor-pointer" onClick={handleLogout}>
            <LogoutOutlined className="!text-base" />
            <Typography.Text className="!text-sm text">Cerrar sesión</Typography.Text>
          </div>
        </div>
        {contextHolder}
      </Popover>
      <ChangeBranchModal open={open} onCancel={handleOpen} />
    </>
  );
};

export default MenuPopover;
