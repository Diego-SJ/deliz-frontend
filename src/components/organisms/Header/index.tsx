import { Button, Space } from 'antd';
import { HeaderActions, HeaderRoot } from './styles';
import MenuPopover from '@/components/molecules/MenuPopover';
import useMediaQuery from '@/hooks/useMediaQueries';
import { MenuOutlined } from '@ant-design/icons';
import { PageTitleProvider } from '@/contexts/page-title-context';
import HeaderTitlte from './header-title';
import AIButton from '@/components/atoms/ai-button';
import { ModuleAccess } from '@/routes/module-access';

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
      <div className="flex items-center gap-2 md:gap-5">
        <ModuleAccess moduleName="chat_ia">
          <AIButton />
        </ModuleAccess>
        <MenuPopover />
      </div>
    </HeaderRoot>
  );
};

export default Header;
