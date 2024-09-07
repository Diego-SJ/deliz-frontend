import { CashOperation } from '@/redux/reducers/cashiers/types';

import { getColorName, getImageType, OPERATION_TYPE_NAME } from '../current-cash-cut/active-cashier';
import { Avatar, List, Typography } from 'antd';
import { PAYMENT_METHOD_NAME } from '@/constants/payment_methods';
import functions from '@/utils/functions';
import { useIntersectionObserver } from '@uidotdev/usehooks';

const OperationItem = ({ data }: { data: CashOperation }) => {
  const { border, bg } = getColorName(data.operation_type);
  const [ref, entry] = useIntersectionObserver({
    threshold: 0,
    root: null,
    rootMargin: '0px',
  });

  return (
    <List.Item ref={ref} className="w-full min-h-[73px] max-h-[73px]">
      {entry?.isIntersecting ? (
        <div className="flex justify-between w-full px-4">
          <div className="flex gap-4 ">
            <Avatar
              src={getImageType(data?.operation_type)}
              className={`p-[0.4rem] ${bg} border-2 ${border} min-w-[3rem] min-h-[3rem] max-w-[3rem] max-h-[3rem]`}
            />
            <div className="flex flex-col">
              <Typography.Text className="text-base font-normal">
                {OPERATION_TYPE_NAME[data.operation_type] || '- - -'}{' '}
                {PAYMENT_METHOD_NAME[data.payment_method] || data.payment_method || '- - -'}
              </Typography.Text>
              <Typography.Text className="text-sm text-slate-400 font-light">{data.name || '- - -'}</Typography.Text>
            </div>
          </div>
          <div className="flex flex-col items-end min-w-[35%]">
            <Typography.Text className="text-base font-medium mb-1">{functions.money(data.amount)}</Typography.Text>
            <Typography.Text className="text-xs text-slate-400 font-light text-end">
              {functions.tableDate(data.created_at)}
            </Typography.Text>
          </div>
        </div>
      ) : null}
    </List.Item>
  );
};

export default OperationItem;
