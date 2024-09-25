import CardRoot from '@/components/atoms/Card';
import { Sale } from '@/redux/reducers/sales/types';
import { Avatar, Badge, Empty, Select, Tag } from 'antd';
import dayjs from 'dayjs';
import { Clock9 } from 'lucide-react';
import numeral from 'numeral';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/es';
import { useAppDispatch, useAppSelector } from '@/hooks/useStore';
import { analyticsActions } from '@/redux/reducers/analytics';
import { useState } from 'react';

dayjs.extend(relativeTime);
dayjs.locale('es');

type Props = {
  data?: Partial<Sale>[];
};

const Pendingsales = ({ data = [] }: Props) => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const { filters } = useAppSelector(({ analytics }) => analytics.sales);

  const onChange = async (value: number) => {
    setLoading(true);
    await dispatch(analyticsActions.setSalesFilters({ limits: { ...filters?.limits, pending: value } }));
    await dispatch(analyticsActions.sales.getLastPendingSales());
    setLoading(false);
  };

  return (
    <CardRoot
      loading={loading}
      title="Ventas pendientes"
      className="overflow-hidden"
      extra={
        <Select
          options={[
            { label: 'Últimos 5', value: 5 },
            { label: 'Últimos 10', value: 10 },
          ]}
          value={filters?.limits?.pending || 5}
          onChange={onChange}
        />
      }
      classNames={{
        body: '!p-0 overflow-hidden',
      }}
    >
      {!!data?.length ? (
        <>
          {data.map(sale => (
            <div key={sale.sale_id} className="w-full flex items-center py-3 px-4 gap-5 hover:bg-slate-50 cursor-pointer">
              <Avatar icon={<Clock9 className="text-slate-600 w-4 h-4" />} className="bg-slate-600/10 w-9 min-w-9 h-9" />
              <div className="flex items-center justify-between w-full">
                <div className="flex flex-col">
                  <h5 className="m-0 text-sm font-medium capitalize mb-1">
                    {(sale as any)?.customers?.name || 'Público en general'}
                  </h5>
                  <div className="flex items-center">
                    <span className="text-slate-500 mr-2 font-extralight text-xs">
                      <Badge status="warning" /> Pendiente
                    </span>
                    <span className="text-xs font-light text-gray-400">{dayjs(sale?.created_at).fromNow()}</span>
                  </div>
                </div>
                <p className="m-0 text-sm font-medium">{numeral(sale?.total).format('$0,0.00')}</p>
              </div>
            </div>
          ))}
        </>
      ) : (
        <div className="py-10">
          <Empty description="No hay ventas pendientes" />
        </div>
      )}
    </CardRoot>
  );
};

export default Pendingsales;
