import functions from '@/utils/functions';
import { Avatar } from 'antd';
import { ArrowDown, ArrowUp } from 'lucide-react';

type Props = {
  icon: React.ReactNode;
  iconClassName?: string;
  title: string;
  value: number;
  className?: string;
  size?: 'small' | 'default';
  children?: React.ReactNode;
  showArrow?: boolean;
  discrete?: boolean;
};

const ProfitInsight = ({
  icon,
  iconClassName,
  title,
  value,
  className,
  size = 'default',
  children,
  showArrow = false,
  discrete = false,
}: Props) => {
  return (
    <div
      className={`w-full flex flex-col bg-white rounded-xl border px-4 py-4 ${className}`}
    >
      <div className="flex items-center gap-5">
        <Avatar
          shape="square"
          icon={icon}
          className={`${size === 'default' ? 'w-10 h-10' : 'w-8 h-8'} !rounded-xl border-primary !bg-primary/10 ${
            iconClassName || ''
          }`}
        />
        <div>
          <div className="flex gap-2 items-center">
            <h5
              className={`m-0 ${size === 'default' ? 'text-2xl' : 'text-lg'} font-semibold`}
            >
              {functions.money(value, { hidden: discrete })}
            </h5>
            {showArrow ? (
              value < 0 ? (
                <ArrowDown className="text-red-500 w-4" />
              ) : (
                <ArrowUp className="text-blue-500 w-4" />
              )
            ) : null}
          </div>
          <p className={'m-0 text-xs font-light text-gray-400'}>{title}</p>
        </div>
      </div>
      {!!children ? children : null}
    </div>
  );
};

export default ProfitInsight;
