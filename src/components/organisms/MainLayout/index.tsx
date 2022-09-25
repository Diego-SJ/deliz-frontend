import { Outlet } from 'react-router-dom';
import { LayoutContainer, LayoutContent, LayoutRoot, LayoutSider } from './styles';
import { MainLayoutProps } from './types';
import SideMenu from '../SideMenu';
import Header from '../Header';

const SIDER_WIDTH = 250;

const MainLayout: React.FC<MainLayoutProps> = () => {
  return (
    <LayoutRoot hasSider>
      <LayoutSider width={SIDER_WIDTH}>
        <SideMenu />
      </LayoutSider>
      <LayoutContainer style={{ marginLeft: SIDER_WIDTH }}>
        <Header />
        <LayoutContent>
          <Outlet />
        </LayoutContent>
      </LayoutContainer>
    </LayoutRoot>
  );
};

export default MainLayout;
