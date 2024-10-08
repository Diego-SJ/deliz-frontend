import useMediaQuery from '@/hooks/useMediaQueries';
import SettingsMenu from './menu';
import { Outlet } from 'react-router-dom';
import BottomMenu from '@/components/organisms/bottom-menu';

const SettingsPage = () => {
  const { isMobile, isTablet } = useMediaQuery();

  return (
    <div className="flex flex-col md:flex-row">
      {!isMobile ? (
        <div className="w-full hidden md:w-64 md:block">
          <SettingsMenu />
        </div>
      ) : null}
      <div className="h-[calc(100dvh-64px)] overflow-y-scroll w-full relative">
        <Outlet />
      </div>

      {isTablet && (
        <>
          <div className="h-[100px]" />
          <BottomMenu />
        </>
      )}
    </div>
  );
};

export default SettingsPage;
