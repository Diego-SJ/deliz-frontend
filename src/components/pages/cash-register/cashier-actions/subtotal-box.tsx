import functions from '@/utils/functions';
import { Typography } from 'antd';

type Props = {
  amount?: number;
  prevAmount?: number;
  hasChanged?: boolean;
};

const SubtotalBox = ({ amount = 0, prevAmount = 0, hasChanged = false }: Props) => {
  return (
    <div className="bg-gray-50 text-center rounded-lg px-5 py-6 mb-4">
      <Typography.Paragraph className="!m-0 text-lg font-light text-gray-400">Total</Typography.Paragraph>
      <Typography.Title level={4} className={`!m-0 !font-semibold !text-xl`}>
        <span className={`${hasChanged ? 'line-through !text-gray-400 font-light' : ''}`}>{functions.money(prevAmount)}</span>

        {hasChanged && <span className={`ml-3`}>{functions.money(amount)}</span>}
      </Typography.Title>
    </div>
  );
};

export default SubtotalBox;
