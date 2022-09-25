import { Typography } from 'antd';
import { AvatarInfo, AvatarRoot, AvatarShape } from './styles';
import { AvatarProps } from './types';

const Avatar = ({ avatar, title, subtitle, bordered = false }: AvatarProps) => {
  return (
    <AvatarRoot>
      <AvatarShape {...avatar} size={avatar?.size ?? 50} className={bordered ? 'bordered' : ''} />
      <AvatarInfo hidden={!title && !subtitle}>
        {title && (
          <Typography.Title className="avatar-title" level={5}>
            {title}
          </Typography.Title>
        )}
        {subtitle && <Typography.Text className="avatar-subtitle">{subtitle}</Typography.Text>}
      </AvatarInfo>
    </AvatarRoot>
  );
};

export default Avatar;
