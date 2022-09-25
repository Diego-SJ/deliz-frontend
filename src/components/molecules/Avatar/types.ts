import { AvatarProps as AvatarPropsAntd } from 'antd';

export type AvatarProps = {
  bordered?: boolean;
  avatar?: AvatarPropsAntd;
  title?: React.ReactNode | string;
  subtitle?: React.ReactNode | string;
};
