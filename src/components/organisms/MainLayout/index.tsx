import { Outlet } from 'react-router-dom';
import SideMenu from '../SideMenu';
import Header from '../Header';
import { MainLayoutProps } from './types';
import { LayoutContainer, LayoutContent, LayoutRoot, LayoutSider } from './styles';
import useMediaQuery from '@/hooks/useMediaQueries';
import { Drawer } from 'antd';
import { useState } from 'react';

const SIDER_WIDTH = 250;

const MainLayout: React.FC<MainLayoutProps> = () => {
  const { isTablet } = useMediaQuery();
  const [open, setOpen] = useState(false);

  const handleDrawer = () => {
    setOpen(prev => !prev);
  };
  return (
    <LayoutRoot hasSider={!isTablet}>
      {!isTablet && (
        <LayoutSider width={SIDER_WIDTH}>
          <SideMenu />
        </LayoutSider>
      )}
      <Drawer placement="left" width={300} open={open} onClose={handleDrawer} bodyStyle={{ padding: 0 }}>
        <SideMenu onClick={handleDrawer} />
      </Drawer>
      <LayoutContainer>
        <Header onClick={handleDrawer} />
        <LayoutContent>
          <Outlet />
        </LayoutContent>
      </LayoutContainer>
    </LayoutRoot>
  );
};

export default MainLayout;
