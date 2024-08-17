import { Outlet } from 'react-router-dom';
import SideMenu from '../SideMenu';
import Header from '../Header';
import { MainLayoutProps } from './types';
import { LayoutContainer, LayoutContent, LayoutRoot, LayoutSider } from './styles';
import useMediaQuery from '@/hooks/useMediaQueries';
import { Button, Drawer } from 'antd';
import { ReactNode, useEffect, useRef, useState } from 'react';
import { useAppDispatch } from '@/hooks/useStore';
import { userActions } from '@/redux/reducers/users';
import SideMobileMenu from '../SideMenu/mobile-menu';
import { CloseOutlined } from '@ant-design/icons';

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
        <LayoutSider width={SIDER_WIDTH} collapsed={isPhablet} className="!border-r" theme={'light' as any}>
          <SideMenu />
        </LayoutSider>
      )}
      <Drawer
        placement="bottom"
        height={'100dvh'}
        open={open}
        closeIcon={<></>}
        extra={
          <Button onClick={handleDrawer} type="text" icon={<CloseOutlined className="text-slate-900 !text-2xl" />} size="large" />
        }
        onClose={handleDrawer}
        classNames={{ body: '!bg-neutral-100 !px-5 !pt-0', header: '!bg-neutral-100 !border-b-transparent' }}
      >
        <SideMobileMenu onClick={handleDrawer} />
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
