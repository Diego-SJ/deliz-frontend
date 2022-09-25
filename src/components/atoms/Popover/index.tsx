import { PopoverProps as PopoverPropsAntd } from 'antd';
import { PopoverAntd } from './styles';
import { PopoverProps } from './types';

const Popover = ({ triggerComponent, children, nopadding, ...props }: PopoverProps) => {
  return (
    <PopoverAntd
      {...(props as PopoverPropsAntd)}
      content={children}
      overlayInnerStyle={{ borderRadius: 10, padding: 0 }}
      overlayClassName={nopadding ? 'app-custom-popover nopadding' : ''}
    >
      {triggerComponent}
    </PopoverAntd>
  );
};

export default Popover;
