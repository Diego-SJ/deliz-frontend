import { Typography } from 'antd';
import { AvatarInfo, AvatarShape } from './styles';
import { AvatarProps } from './types';
import { BankOutlined } from '@ant-design/icons';

const Avatar = ({ avatar, title, subtitle }: AvatarProps) => {
  return (
    <div className="flex items-center sm:gap-3">
      <AvatarShape
        {...avatar}
        size={avatar?.size ?? 40}
        className={'bg-primary/10 '}
        icon={<BankOutlined className="text-primary" />}
      />
      <AvatarInfo hidden={!title && !subtitle}>
        {title && <Typography.Paragraph className="avatar-title !m-0 font-medium select-none">{title}</Typography.Paragraph>}
        {subtitle && <Typography.Text className="!m-0 text-neutral-400 select-none">{subtitle}</Typography.Text>}
      </AvatarInfo>
    </div>
  );
};

export default Avatar;
