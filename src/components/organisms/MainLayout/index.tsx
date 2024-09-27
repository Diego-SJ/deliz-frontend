import { Outlet } from 'react-router-dom';
import Header from '../Header';
import { MainLayoutProps } from './types';
import { LayoutContainer, LayoutContent, LayoutRoot } from './styles';
import useMediaQuery from '@/hooks/useMediaQueries';

import { ReactNode, useEffect, useRef, useState } from 'react';
import { useAppDispatch } from '@/hooks/useStore';
import { userActions } from '@/redux/reducers/users';
import SideMobileMenu from '../SideMenu/mobile-menu';
import SideMenu from '../SideMenu';

const MainLayout: React.FC<MainLayoutProps> = () => {
  const dispatch = useAppDispatch();
  const { isTablet } = useMediaQuery();
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
      {!isTablet ? <SideMenu /> : <SideMobileMenu open={open} closeDrawer={handleDrawer} />}

      <LayoutContainer className="!bg-background">
        <Header onClick={handleDrawer} />
        <LayoutContent className="relative !bg-transparent">
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
