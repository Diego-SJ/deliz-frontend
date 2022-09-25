import { Typography } from 'antd';
import { PopoverItemRoot } from './styles';
import { PopoverItemProps } from './types';
import Avatar from '../Avatar';

const PopoverItem = ({ title, message, caption }: PopoverItemProps) => {
  return (
    <PopoverItemRoot>
      <Avatar title={title} subtitle={message} />

      <Typography.Text>{caption}</Typography.Text>
    </PopoverItemRoot>
  );
};

export default PopoverItem;
