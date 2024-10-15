import ReportEmpty from '@/components/atoms/report-empty';
import { CustomerTop } from '@/redux/reducers/analytics/types';
import functions from '@/utils/functions';
import { UserOutlined } from '@ant-design/icons';
import { Avatar, Typography } from 'antd';
import { Trophy } from 'lucide-react';

export const TEX_COLOR: { [key: number]: string } = {
  0: 'text-primary',
  1: 'text-yellow-500',
  2: 'text-orange-400',
};
export const BG_COLOR: { [key: number]: string } = {
  0: 'bg-primary/10',
  1: 'bg-yellow-500/10',
  2: 'bg-orange-400/10',
};

type Props = {
  data?: CustomerTop[];
  hideData?: boolean;
};

const CustomerList = ({ data, hideData }: Props) => {
  return (
    <div>
      {data?.length ? (
        <div className="flex flex-col h-64 md:h-96 print:!h-auto overflow-y-scroll">
          {data?.map((product, index) => {
            return (
              <div
                key={index}
                className={`flex justify-between items-center py-2 pl-1 pr-2 gap-4 border-t ${
                  index !== 0 ? 'border--100' : 'border-transparent'
                }`}
              >
                <Avatar
                  icon={
                    index <= 2 ? (
                      <Trophy className={`!w-6 !h-6 ${TEX_COLOR[index]}`} />
                    ) : (
                      <UserOutlined className="text-slate-400 text-2xl" />
                    )
                  }
                  className={`!w-10 !min-w-10 !h-10 p-1 rounded-xl ${BG_COLOR[index] || 'bg-slate-400/10'}`}
                />
                <Typography.Text className="!text-sm !m-0 text-start w-full">
                  {product.name}
                </Typography.Text>
                <Typography.Text className="!text-sm !m-0 !w-fit min-w-40 text-end">
                  {functions.money(product.total_amount, {
                    hidden: hideData,
                  })}
                </Typography.Text>
              </div>
            );
          })}
        </div>
      ) : (
        <ReportEmpty />
      )}
    </div>
  );
};

export default CustomerList;
