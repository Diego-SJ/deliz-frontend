import CardRoot from '@/components/atoms/Card';
import { PAYMENT_METHOD_NAME, Sale } from '@/redux/reducers/sales/types';
import { Avatar, Empty, Select } from 'antd';
import dayjs from 'dayjs';
import { Banknote, ShoppingCart } from 'lucide-react';
import numeral from 'numeral';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/es';
import { analyticsActions } from '@/redux/reducers/analytics';
import { useAppDispatch, useAppSelector } from '@/hooks/useStore';
import { useState } from 'react';

dayjs.extend(relativeTime);
dayjs.locale('es');

type Props = {
  data?: Partial<Sale>[];
};

const LastCompletedSales = ({ data = [] }: Props) => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const { filters } = useAppSelector(({ analytics }) => analytics.sales);

  const onChange = async (value: number) => {
    setLoading(true);
    await dispatch(analyticsActions.setSalesFilters({ limits: { ...filters?.limits, completed: value } }));
    await dispatch(analyticsActions.sales.getLastCompletedSales());
    setLoading(false);
  };

  return (
    <CardRoot
      loading={loading}
      title="Últimas ventas realizadas"
      extra={
        <Select
          options={[
            { label: 'Últimos 5', value: 5 },
            { label: 'Últimos 10', value: 10 },
          ]}
          value={filters?.limits?.completed || 5}
          onChange={onChange}
        />
      }
      classNames={{
        body: '!p-0',
      }}
    >
      {data?.length ? (
        <>
          {data?.map(sale => (
            <div key={sale?.sale_id} className="w-full flex items-center py-3 px-4 gap-5 hover:bg-slate-50 cursor-pointer">
              <Avatar icon={<ShoppingCart className="text-slate-600 w-4 h-4" />} className="bg-slate-600/10 w-9 min-w-9 h-9" />
              <div className="flex items-center justify-between w-full">
                <div className="flex flex-col">
                  <h5 className="m-0 text-sm font-medium capitalize mb-1">
                    {(sale as any)?.customers?.name || 'Público en general'}
                  </h5>
                  <div className="flex items-center">
                    <div className="flex gap-1 items-center">
                      <Banknote className="text-green-500 w-4 h-4" />
                      <span className="text-xs font-light text-gray-400">
                        {PAYMENT_METHOD_NAME[sale?.payment_method as keyof typeof PAYMENT_METHOD_NAME]}
                      </span>
                    </div>
                    <span className="text-xs font-light text-gray-400 ml-5">{dayjs(sale?.created_at).fromNow()}</span>
                  </div>
                </div>
                <p className="m-0 text-sm font-medium">{numeral(sale?.total).format('$0,0.00')}</p>
              </div>
            </div>
          ))}
        </>
      ) : (
        <div className="py-10">
          <Empty description="No hay ventas realizadas" />
        </div>
      )}
    </CardRoot>
  );
};

export default LastCompletedSales;
