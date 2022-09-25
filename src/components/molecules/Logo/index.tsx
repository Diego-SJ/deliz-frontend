import { APP_ROUTES } from '@/constants/routes';
import { Typography } from 'antd';
import { NavLink } from 'react-router-dom';
import { LogoImg, LogoRoot } from './styles';
import { LogoProps } from './types';

const Logo = ({ src, title }: LogoProps) => {
  return (
    <NavLink to={APP_ROUTES.PRIVATE.DASHBOARD.HOME}>
      <LogoRoot>
        <LogoImg src={src} alt={title} />
        <Typography.Title level={5}>{title}</Typography.Title>
      </LogoRoot>
    </NavLink>
  );
};

export default Logo;
