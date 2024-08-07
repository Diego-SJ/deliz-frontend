import { APP_ROUTES } from '@/routes/routes';
import { useNavigate } from 'react-router-dom';
import { LogoProps } from './types';

const Logo = ({ src, title }: LogoProps) => {
  const navigate = useNavigate();

  const handleOnClick = () => {
    navigate(APP_ROUTES.PRIVATE.DASHBOARD.HOME.path);
  };

  return (
    <div className="flex items-center pt-14" onClick={handleOnClick}>
      <img className="max-md:w-16 max-md:h-16 w-10 h-10  lg:w-16 lg:h-16 aspect-square mx-auto" src={src} alt={title} />
    </div>
  );
};

export default Logo;
