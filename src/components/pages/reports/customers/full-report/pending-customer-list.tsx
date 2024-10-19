import ReportEmpty from '@/components/atoms/report-empty';
import { DebtorCustomer } from '@/redux/reducers/analytics/types';
import { APP_ROUTES } from '@/routes/routes';
import functions from '@/utils/functions';
import { Avatar, Button, Typography } from 'antd';
import { ContactRound, ExternalLink } from 'lucide-react';

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
  data?: DebtorCustomer[];
  hideData?: boolean;
};

const PendingCustomerList = ({ data, hideData }: Props) => {
  return (
    <div>
      {data?.length ? (
        <div className="flex flex-col h-72 print:!h-auto overflow-y-scroll">
          {data?.map((item, index) => {
            return (
              <div
                key={item?.customer_id}
                className={`flex flex-col py-2 pl-2 pr-2 border-t hover:bg-slate-50 ${index !== 0 ? 'border-100 py-3' : 'border-transparent'}`}
              >
                <div className="flex justify-between items-center gap-4 mb-1">
                  <Avatar
                    icon={<ContactRound className="text-slate-400 text-2xl" />}
                    className={`!w-10 !min-w-10 !h-10 p-1 rounded-xl ${'bg-slate-400/10'}`}
                  />
                  <Typography.Text className="!text-sm !m-0 text-start w-full">
                    {item.customer_name || 'Público general'}
                  </Typography.Text>
                  <Typography.Text className="!text-sm !m-0 !w-fit min-w-40 text-end">
                    Pagos pendientes: {functions.number(item.sales?.length, { hidden: hideData })}
                  </Typography.Text>
                </div>
                <div className="flex items-end flex-col">
                  {item?.sales?.map((sale) => (
                    <div key={sale?.sale_id} className={`flex items-center py-1 gap-5`}>
                      <span className="text-sm m-0 text-gray-600 font-medium">
                        {functions.money(sale.total, { hidden: hideData })}
                      </span>
                      <span className="text-xs m-0 text-gray-400">{functions.tableDate(sale?.created_at || '')}</span>
                      <Button
                        type="link"
                        size="small"
                        className="m-0 !text-primary font-medium"
                        icon={<ExternalLink className="w-4" />}
                        iconPosition="end"
                        target="_blank"
                        href={APP_ROUTES.PRIVATE.SALE_DETAIL.hash`${sale!.sale_id!}`}
                      >
                        Ver detalles
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <ReportEmpty title="No hay clientes con pagos pendientes" />
      )}
    </div>
  );
};

export default PendingCustomerList;
