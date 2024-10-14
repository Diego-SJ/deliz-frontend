import { LastCustomerSale } from '@/redux/reducers/analytics/types';
import { UserOutlined } from '@ant-design/icons';
import { Avatar, Empty, Tag, Typography } from 'antd';
import { Trophy } from 'lucide-react';
import { BG_COLOR, TEX_COLOR } from './customer-list';
import functions from '@/utils/functions';

type LastCustomersProps = {
  data?: LastCustomerSale[];
  hideData?: boolean;
};

const LastCustomers = ({ data, hideData }: LastCustomersProps) => {
  return (
    <>
      {data?.length ? (
        <div className="flex flex-col h-64 md:h-96 overflow-y-scroll">
          {data?.map((customer, index) => {
            return (
              <div
                key={index}
                className={`flex items-center py-2 pl-1 pr-2 gap-4 border-t ${
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
                <Typography.Text className="!text-sm !m-0 text-start w-60">
                  {customer.customer_name}
                </Typography.Text>
                <Tag className="">
                  {functions.number(customer.total_sales, {
                    hidden: hideData,
                  })}
                </Tag>
                <Typography.Text className="!text-sm !m-0 !w-fit min-w-20 text-end">
                  {functions.money(customer.total_amount, {
                    hidden: hideData,
                  })}
                </Typography.Text>
              </div>
            );
          })}
        </div>
      ) : (
        <Empty description="No hay datos disponibles" />
      )}
    </>
  );
};

export default LastCustomers;
