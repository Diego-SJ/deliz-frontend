import Popover from '@/components/atoms/Popover';
import { CaretDownOutlined, ExclamationCircleOutlined, LogoutOutlined, SettingOutlined, TeamOutlined } from '@ant-design/icons';
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
      icon: <ExclamationCircleOutlined rev={{}} />,
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
      triggerComponent={<CaretDownOutlined rev={{}} style={{ fontSize: 22, color: theme.colors.primary, marginTop: 10 }} />}
      placement="bottomRight"
      trigger="click"
      nopadding
    >
      <PopoverBody>
        <IconItem>
          <TeamOutlined rev={{}} />
          <Typography.Text>Perfil</Typography.Text>
        </IconItem>
        <IconItem>
          <SettingOutlined rev={{}} />
          <Typography.Text>Configuración</Typography.Text>
        </IconItem>
        <IconItem className="danger" onClick={handleLogout}>
          <LogoutOutlined rev={{}} />
          <Typography.Text>Cerrar sesión</Typography.Text>
        </IconItem>
      </PopoverBody>
      {contextHolder}
    </Popover>
  );
};

export default MenuPopover;
