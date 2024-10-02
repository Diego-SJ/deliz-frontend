import { Avatar, Button, Empty, Tooltip, Typography } from 'antd';
import CardRoot from '@/components/atoms/Card';
import { useAppSelector } from '@/hooks/useStore';
import { UserOutlined } from '@ant-design/icons';
import functions from '@/utils/functions';
import { CloudDownload, SquareChartGantt, Trophy } from 'lucide-react';
import { useMembershipAccess } from '@/routes/module-access';
import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { useNavigate } from 'react-router-dom';
import { APP_ROUTES } from '@/routes/routes';

const TopCustomersThumbnail = () => {
  const navigate = useNavigate();
  const { hasAccess } = useMembershipAccess();
  const { user_auth } = useAppSelector(({ users }) => users);
  const { loading, top_customers } = useAppSelector(({ analytics }) => analytics?.customers || {});
  const elementRef = useRef<any>(null);

  const handlePrint = useReactToPrint({
    content: () => elementRef.current,
  });

  const onActionClick = () => {
    navigate(APP_ROUTES.PRIVATE.REPORTS.SALES.path);
  };

  return (
    <CardRoot
      loading={loading}
      title={<h5 className="!text-base m-0 font-medium">Los 10 mejores clientes</h5>}
      extra={
        <div className="flex gap-3">
          {user_auth?.profile?.permissions?.reports?.view_customers_report?.value && hasAccess('view_customers_report') ? (
            <Tooltip title="Ver reporte completo">
              <Button onClick={onActionClick} icon={<SquareChartGantt className="w-4 h-4" />} />
            </Tooltip>
          ) : null}
          <Button onClick={handlePrint} icon={<CloudDownload className="w-4 h-4" />} />
        </div>
      }
      classNames={{ body: '!px-4 !pt-2' }}
    >
      <div className="w-full" ref={elementRef}>
        {top_customers?.length ? (
          <>
            <div className="hidden print:flex justify-between items-center mb-2 pl-1 pr-2">
              <Typography.Title level={2} className="!text-3xl !m-0">
                Los 10 mejores clientes
              </Typography.Title>
            </div>
            <div className="flex flex-col">
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
      </div>
    </CardRoot>
  );
};

export default TopCustomersThumbnail;
