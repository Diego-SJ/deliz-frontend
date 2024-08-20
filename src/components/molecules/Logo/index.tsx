import { APP_ROUTES } from '@/routes/routes';
import { useNavigate } from 'react-router-dom';
import { LogoProps } from './types';
import { useAppSelector } from '@/hooks/useStore';

const Logo = ({ src, title }: LogoProps) => {
  const navigate = useNavigate();
  const { company } = useAppSelector(({ app }) => app);

  const handleOnClick = () => {
    navigate(APP_ROUTES.PRIVATE.HOME.path);
  };

  return (
    <div className="flex pt-5 items-center justify-start px-5 flex-col w-full" onClick={handleOnClick}>
      <div className="flex w-full">
        <img className="max-md:w-16 max-md:h-16 w-10 h-10  lg:w-6 lg:h-6 aspect-square" src={src} alt={title} />
        <span className="ml-2 text-base font-bold max-lg:hidden">{company?.name || 'Posiffy'}</span>
      </div>
      <span className="text-xs text-slate-400 font-light w-full max-lg:hidden">{company?.email || 'Posiffy'}</span>
    </div>
  );
};

export default Logo;
