import { Outlet } from 'react-router-dom';
import SideMenu from '../SideMenu';
import Header from '../Header';
import { MainLayoutProps } from './types';
import { LayoutContainer, LayoutContent, LayoutRoot, LayoutSider } from './styles';

const SIDER_WIDTH = 250;

const MainLayout: React.FC<MainLayoutProps> = () => {
  return (
    <LayoutRoot hasSider>
      <LayoutSider width={SIDER_WIDTH}>
        <SideMenu />
      </LayoutSider>
      <LayoutContainer>
        <Header />
        <LayoutContent>
          <Outlet />
        </LayoutContent>
      </LayoutContainer>
    </LayoutRoot>
  );
};

export default MainLayout;
