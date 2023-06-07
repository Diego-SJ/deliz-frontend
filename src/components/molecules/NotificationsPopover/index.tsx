import Popover from '@/components/atoms/Popover';
import { NOTIFICATIONS } from '@/constants/mocks';
import functions from '@/utils/functions';
import { BellOutlined } from '@ant-design/icons';
import { Typography } from 'antd';
import { useTheme } from 'styled-components';
import PopoverItem from '../PopoverItem';
import { PopoverBody, PopoverFooter, PopoverHeader } from './styles';

const NotificationsPopover = () => {
  const theme = useTheme();
  return (
    <Popover
      triggerComponent={<BellOutlined rev={{}} style={{ fontSize: 22, color: theme.colors.tertiary }} />}
      placement="bottomRight"
      trigger="click"
      nopadding
    >
      <PopoverHeader>
        <Typography.Text>Notificaciones</Typography.Text>
        <Typography.Link>Marcar todo como leido</Typography.Link>
      </PopoverHeader>
      <PopoverBody>
        {NOTIFICATIONS.map(item => (
          <PopoverItem key={item.id} title={item.title} message={item.message} caption={functions.distanceTime(item.date)} />
        ))}
      </PopoverBody>
      <PopoverFooter>
        <Typography.Link>Ver todas las notificaciones</Typography.Link>
      </PopoverFooter>
    </Popover>
  );
};

export default NotificationsPopover;
