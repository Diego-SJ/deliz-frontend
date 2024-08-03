import { Outlet } from 'react-router-dom';
import SideMenu from '../SideMenu';
import Header from '../Header';
import { MainLayoutProps } from './types';
import { LayoutContainer, LayoutContent, LayoutRoot, LayoutSider } from './styles';
import useMediaQuery from '@/hooks/useMediaQueries';
import { Drawer } from 'antd';
import { ReactNode, useEffect, useRef, useState } from 'react';
import { useAppDispatch } from '@/hooks/useStore';
import { userActions } from '@/redux/reducers/users';

const SIDER_WIDTH = 250;

const MainLayout: React.FC<MainLayoutProps> = () => {
  const dispatch = useAppDispatch();
  const { isTablet, isPhablet } = useMediaQuery();
  const [open, setOpen] = useState(false);
  const firstRender = useRef(true);

  useEffect(() => {
    if (!firstRender.current) {
      firstRender.current = true;
      dispatch(userActions.fetchAppData());
    }
  }, [firstRender, dispatch]);

  const handleDrawer = () => {
    setOpen(prev => !prev);
  };

  return (
    <LayoutRoot hasSider={!isTablet}>
      {!isTablet && (
        <LayoutSider width={SIDER_WIDTH} collapsed={isPhablet} className="bg-[#001628]">
          <SideMenu />
        </LayoutSider>
      )}
      <Drawer
        placement="left"
        width={300}
        open={open}
        onClose={handleDrawer}
        styles={{ body: { padding: 0, background: '#001628' }, header: { background: '#001628' } }}
        className="bg-[#001628]"
      >
        <SideMenu onClick={handleDrawer} />
      </Drawer>
      <LayoutContainer>
        <Header onClick={handleDrawer} />
        <LayoutContent className="relative">
          <Outlet />
        </LayoutContent>
      </LayoutContainer>
    </LayoutRoot>
  );
};

export const PaddingLayout = ({ children }: { children?: ReactNode }) => {
  return <div className="p-4 relative">{children}</div>;
};

export default MainLayout;
