import Popover from '@/components/atoms/Popover';
import { CaretDownOutlined, LogoutOutlined, SettingOutlined, TeamOutlined } from '@ant-design/icons';
import { Typography } from 'antd';
import { useTheme } from 'styled-components';
import { PopoverBody, IconItem } from './styles';

const MenuPopover = () => {
  const theme = useTheme();
  return (
    <Popover
      triggerComponent={<CaretDownOutlined style={{ fontSize: 22, color: theme.colors.primary, marginTop: 10 }} />}
      placement="bottomRight"
      trigger="click"
      nopadding
    >
      <PopoverBody>
        <IconItem>
          <TeamOutlined />
          <Typography.Text>Perfil</Typography.Text>
        </IconItem>
        <IconItem>
          <SettingOutlined />
          <Typography.Text>Configuración</Typography.Text>
        </IconItem>
        <IconItem className="danger">
          <LogoutOutlined />
          <Typography.Text>Cerrar sesión</Typography.Text>
        </IconItem>
      </PopoverBody>
    </Popover>
  );
};

export default MenuPopover;
