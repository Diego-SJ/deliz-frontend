import Popover from '@/components/atoms/Popover';
import { CaretDownOutlined, ExclamationCircleOutlined, LogoutOutlined, SettingOutlined } from '@ant-design/icons';
import { Modal, Typography } from 'antd';
import { useTheme } from 'styled-components';
import { PopoverBody, IconItem } from './styles';
import { useAppDispatch } from '@/hooks/useStore';
import { userActions } from '@/redux/reducers/users';

const MenuPopover = () => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
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

  return (
    <Popover
      triggerComponent={<CaretDownOutlined style={{ fontSize: 22, color: theme.colors.primary, marginTop: 10 }} />}
      placement="bottomRight"
      trigger="click"
      nopadding
    >
      <PopoverBody>
        {/* <IconItem>
          <TeamOutlined />
          <Typography.Text>Cuenta</Typography.Text>
        </IconItem> */}
        <IconItem>
          <SettingOutlined />
          <Typography.Text>Configuración</Typography.Text>
        </IconItem>
        <IconItem className="danger" onClick={handleLogout}>
          <LogoutOutlined />
          <Typography.Text>Cerrar sesión</Typography.Text>
        </IconItem>
      </PopoverBody>
      {contextHolder}
    </Popover>
  );
};

export default MenuPopover;
