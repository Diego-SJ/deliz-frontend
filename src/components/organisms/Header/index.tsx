import Avatar from '@/components/molecules/Avatar';
import { PROFILE_PIC } from '@/constants/mocks';
import { Button, Divider, Space, Typography } from 'antd';
import { HeaderActions, HeaderRoot } from './styles';
import MenuPopover from '@/components/molecules/MenuPopover';
import { useAppSelector } from '@/hooks/useStore';
import useMediaQuery from '@/hooks/useMediaQueries';
import { MenuOutlined } from '@ant-design/icons';
import { BORING_AVATARS } from '@/constants/avatars';

type HeaderProps = {
  onClick?: () => void;
};

const Header = ({ onClick }: HeaderProps) => {
  // const theme = useTheme();
  const { user_auth } = useAppSelector(({ users }) => users);
  const { isTablet } = useMediaQuery();

  return (
    <HeaderRoot>
      {isTablet ? (
        <Button onClick={onClick} size="large" type="dashed" icon={<MenuOutlined rev={{}} />}></Button>
      ) : (
        <Typography.Title level={4}>Dashboard</Typography.Title>
      )}
      <HeaderActions>
        {/* <Space size="middle">
          <SearchOutlined rev={{}} style={{ fontSize: 22, color: theme.colors.tertiary }} />
          <MessagesPopover />
          <NotificationsPopover />
        </Space> */}
        <Divider type="vertical" />
        <Space size={isTablet ? 0 : 50}>
          <Avatar
            avatar={{ src: BORING_AVATARS`${user_auth.user?.email || 'admin'}` }}
            title={isTablet ? '' : 'Admin'}
            subtitle={isTablet ? '' : user_auth?.user?.email}
            bordered
          />
          <MenuPopover />
        </Space>
      </HeaderActions>
    </HeaderRoot>
  );
};

export default Header;
