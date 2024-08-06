import { Button, Space } from 'antd';
import { HeaderActions, HeaderRoot } from './styles';
import MenuPopover from '@/components/molecules/MenuPopover';
import useMediaQuery from '@/hooks/useMediaQueries';
import { MenuOutlined } from '@ant-design/icons';
import { PageTitleProvider } from '@/contexts/page-title-context';
import HeaderTitlte from './header-title';

type HeaderProps = {
  onClick?: () => void;
};

const Header = ({ onClick }: HeaderProps) => {
  const { isTablet } = useMediaQuery();

  return (
    <HeaderRoot className="border-b border-gray-200">
      {isTablet ? (
        <Button onClick={onClick} size="large" icon={<MenuOutlined />}></Button>
      ) : (
        <PageTitleProvider>
          <HeaderTitlte />
        </PageTitleProvider>
      )}
      <HeaderActions>
        <Space size={isTablet ? 0 : 50}>
          <MenuPopover />
        </Space>
      </HeaderActions>
    </HeaderRoot>
  );
};

export default Header;
