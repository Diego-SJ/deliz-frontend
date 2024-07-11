import useMediaQuery from '@/hooks/useMediaQueries';
import SettingsMenu from './menu';
import { Outlet } from 'react-router-dom';

const SettingsPage = () => {
  const { isMobile } = useMediaQuery();

  return (
    <div className="flex flex-col md:flex-row">
      {!isMobile ? (
        <div className="w-full hidden md:w-64 md:block">
          <SettingsMenu />
        </div>
      ) : null}
      <div className="h-[calc(100vh-64px)] overflow-y-scroll w-full relative">
        <Outlet />
      </div>
    </div>
  );
};

export default SettingsPage;
