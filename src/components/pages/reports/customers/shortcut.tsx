import { Avatar, Button, Empty, Typography } from 'antd';
import CardRoot from '@/components/atoms/Card';
import { useAppDispatch, useAppSelector } from '@/hooks/useStore';
import { analyticsActions } from '@/redux/reducers/analytics';
import { UserOutlined } from '@ant-design/icons';
import functions from '@/utils/functions';
import { Trophy } from 'lucide-react';

const TopCustomersThumbnail = () => {
  const dispatch = useAppDispatch();
  const { loading, top_customers } = useAppSelector(({ analytics }) => analytics?.customers || {});

  return (
    <CardRoot
      loading={loading}
      title={<h5 className="!text-base m-0 font-medium">Ventas por cliente</h5>}
      extra={
        top_customers?.length ? (
          <Button type="text" className="!text-primary underline" onClick={() => dispatch(analyticsActions.getTopCustomers())}>
            Actualizar
          </Button>
        ) : null
      }
      classNames={{ body: '!px-4 !pt-2' }}
    >
      {top_customers?.length ? (
        <>
          <div className="flex justify-between items-center mb-2 pl-1 pr-2">
            <Typography.Title level={2} className="!text-3xl !m-0">
              {top_customers?.length || 0}
            </Typography.Title>
          </div>
          <div className="flex flex-col max-h-[20rem] overflow-y-auto over">
            {top_customers?.map((product, index) => {
              const TEX_COLOR: { [key: number]: string } = {
                0: 'text-primary',
                1: 'text-yellow-500',
                2: 'text-orange-400',
              };
              const BG_COLOR: { [key: number]: string } = {
                0: 'bg-primary/10',
                1: 'bg-yellow-500/10',
                2: 'bg-orange-400/10',
              };

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
                  <Typography.Text className="!text-sm !m-0 text-start w-full">{product.name}</Typography.Text>
                  <Typography.Text className="!text-sm !m-0 !w-fit min-w-40 text-end">
                    {functions.money(product.total_amount)}
                  </Typography.Text>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <>
          <Empty description="Registra tus primeras ventas para visualizar información" />
        </>
      )}
    </CardRoot>
  );
};

export default TopCustomersThumbnail;
