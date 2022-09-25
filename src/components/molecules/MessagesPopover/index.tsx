import Popover from '@/components/atoms/Popover';
import { MessageOutlined } from '@ant-design/icons';
import { Badge, Typography } from 'antd';
import { useTheme } from 'styled-components';
import { PopoverBody, PopoverFooter, PopoverHeader } from './styles';

const MessagesPopover = () => {
  const theme = useTheme();
  return (
    <Popover
      triggerComponent={
        <Badge count={2}>
          <MessageOutlined style={{ fontSize: 22, color: theme.colors.tertiary }} />
        </Badge>
      }
      placement="bottomRight"
      trigger="click"
      nopadding
    >
      <PopoverHeader>
        <Typography.Text>Mensajes</Typography.Text>
        <Typography.Link>Marcar como leídos</Typography.Link>
      </PopoverHeader>
      <PopoverBody>gergre</PopoverBody>
      <PopoverFooter>
        <Typography.Link>Ver todos los mensajes</Typography.Link>
      </PopoverFooter>
    </Popover>
  );
};

export default MessagesPopover;
