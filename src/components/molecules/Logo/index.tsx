import { APP_ROUTES } from '@/routes/routes';
import { useNavigate } from 'react-router-dom';
import { LogoProps } from './types';
import { useAppSelector } from '@/hooks/useStore';

const Logo = ({ src, title }: LogoProps) => {
  const navigate = useNavigate();
  const { profile } = useAppSelector(({ users }) => users?.user_auth);
  const { company } = useAppSelector(({ app }) => app);

  const handleOnClick = () => {
    navigate(APP_ROUTES.PRIVATE.HOME.path);
  };

  return (
    <div className="flex gap-2 pt-5 items-center justify-start px-5 w-full" onClick={handleOnClick}>
      <div className="min-h-11 max-h-11 min-w-11 max-w-11 flex justify-center items-center rounded-full p-1 bg-gray-100">
        <img className="w-full object-contain" src={src} alt={title} />
      </div>
      <div className="flex w-full flex-col">
        <span className="text-base font-bold hidden lg:inline-block">{company?.name || 'Posiffy'}</span>
        <span className="text-xs text-slate-400 font-light w-full hidden lg:inline-block">{profile?.email || 'Posiffy'}</span>
      </div>
    </div>
  );
};

export default Logo;
