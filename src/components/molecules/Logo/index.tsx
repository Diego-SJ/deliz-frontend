import { APP_ROUTES } from '@/routes/routes';
// import { Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { LogoImg, LogoRoot } from './styles';
import { LogoProps } from './types';

const Logo = ({ src, title }: LogoProps) => {
  const navigate = useNavigate();

  const handleOnClick = () => {
    navigate(APP_ROUTES.PRIVATE.DASHBOARD.HOME.path);
  };
  return (
    <>
      <LogoRoot onClick={handleOnClick}>
        <LogoImg src={src} alt={title} />
        {/* <Typography.Title level={5}>{title}</Typography.Title> */}
      </LogoRoot>
    </>
  );
};

export default Logo;
