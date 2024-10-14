import { Avatar } from 'antd';

type Props = {
  icon: React.ReactNode;
  iconClassName?: string;
  title: string;
  value: string;
  className?: string;
};

const SaleInsight = ({
  icon,
  iconClassName,
  title,
  value,
  className,
}: Props) => {
  return (
    <div
      className={`w-full flex items-center gap-4 bg-white rounded-xl border px-4 py-4 ${className}`}
    >
      <Avatar
        shape="square"
        icon={icon}
        className={`w-10 h-10 !rounded-xl border-primary !bg-primary/10 ${iconClassName || ''}`}
      />
      <div>
        <h5 className="m-0 text-2xl font-semibold">{value}</h5>
        <p className="m-0 text-xs font-light text-gray-400">{title}</p>
      </div>
    </div>
  );
};

export default SaleInsight;
