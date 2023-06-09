import Avatar from '@/components/molecules/Avatar';
import { PROFILE_PIC } from '@/constants/mocks';
import { Divider, Space, Typography } from 'antd';
import { HeaderActions, HeaderRoot } from './styles';
import MenuPopover from '@/components/molecules/MenuPopover';
import { useAppSelector } from '@/hooks/useStore';

const Header = () => {
  // const theme = useTheme();
  const { user_auth } = useAppSelector(({ users }) => users);
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
          <Avatar avatar={{ src: PROFILE_PIC }} title="Admin" subtitle={user_auth?.user?.email} bordered />
          <MenuPopover />
        </Space>
      </HeaderActions>
    </HeaderRoot>
  );
};

export default Header;
