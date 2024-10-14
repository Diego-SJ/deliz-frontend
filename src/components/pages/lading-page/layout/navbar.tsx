import { APP_ROUTES } from '@/routes/routes';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import FallbackImage from '@/assets/logo-color.svg';

const LandingNavbar = () => {
  const navigate = useNavigate();

  const goHome = () => {
    navigate(APP_ROUTES.AUTH.MAIN.path);
  };

  const goToLogin = () => {
    navigate(APP_ROUTES.AUTH.SIGN_IN_ADMIN.path);
  };

  const goToSignUp = () => {
    navigate(APP_ROUTES.AUTH.SIGN_UP.path);
  };

  return (
    <nav className="w-full flex px-4 h-16">
      <div className="flex items-center cursor-pointer" onClick={goHome}>
        <img
          src={FallbackImage}
          alt="Logo"
          className="h-8 w-8 aspect-square mt-3"
        />
        <h3 className="font-black -ml-[0.2rem] text-2xl">
          <span className="text-primary">OS</span>IFFY
        </h3>
      </div>

      <div className="flex items-center justify-end w-full">
        <div className="flex items-center gap-4">
          <Button size="large" className="" type="text" onClick={goToLogin}>
            Iniciar sesión
          </Button>
          <Button
            size="large"
            type="primary"
            className="rounded-full hidden md:inline-block"
            onClick={goToSignUp}
          >
            Registrarse
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default LandingNavbar;
