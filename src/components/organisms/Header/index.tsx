import Avatar from '@/components/molecules/Avatar';
import { PROFILE_PIC } from '@/constants/mocks';
import { Divider, Space, Typography } from 'antd';
import { HeaderActions, HeaderRoot } from './styles';
import NotificationsPopover from '@/components/molecules/NotificationsPopover';
import MessagesPopover from '@/components/molecules/MessagesPopover';
import MenuPopover from '@/components/molecules/MenuPopover';
import { SearchOutlined } from '@ant-design/icons';
import { useTheme } from 'styled-components';

const Header = () => {
  const theme = useTheme();
  return (
    <HeaderRoot>
      <Typography.Title level={4}>Dashboard</Typography.Title>
      <HeaderActions>
        {/* <Space size="middle">
          <SearchOutlined rev={{}} style={{ fontSize: 22, color: theme.colors.tertiary }} />
          <MessagesPopover />
          <NotificationsPopover />
        </Space> */}
        <Divider type="vertical" />
        <Space size={50}>
          <Avatar avatar={{ src: PROFILE_PIC }} title="Diego Salas" subtitle="Admin" bordered />
          <MenuPopover />
        </Space>
      </HeaderActions>
    </HeaderRoot>
  );
};

export default Header;
