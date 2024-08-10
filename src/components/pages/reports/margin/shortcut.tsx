import { Button, Typography } from 'antd';
import { LineChartMargin } from './chart';
import CardRoot from '@/components/atoms/Card';
import { formattedDateRange } from '../utils';
import { useAppDispatch, useAppSelector } from '@/hooks/useStore';
import { LineChartData } from '@/redux/reducers/analytics/types';
import functions from '@/utils/functions';
import { analyticsActions } from '@/redux/reducers/analytics';

const getTotalAmountSales = (data: LineChartData) =>
  data.reduce((acc, series) => acc + series.data.reduce((sum, point) => sum + point.total, 0), 0);

const ReportMarginShortcut = () => {
  const dispatch = useAppDispatch();
  const { loading, data } = useAppSelector(({ analytics }) => analytics?.sales || {});
  const totalAmountSales = getTotalAmountSales(data) || 0;

  return (
    <CardRoot
      loading={loading}
      title={<h5 className="!text-base m-0 font-medium">Monto total de ventas</h5>}
      extra={
        <Button type="text" className="!text-primary underline" onClick={() => dispatch(analyticsActions.getSales())}>
          Actualizar
        </Button>
      }
      classNames={{ body: '!px-4 !pt-2' }}
    >
      <div className="flex justify-between items-center mb-2 pl-1 pr-2">
        <Typography.Title level={2} className="!text-3xl !m-0">
          {functions.money(totalAmountSales)}
        </Typography.Title>

        <Typography.Text className="!text-sm mt-2">{formattedDateRange}</Typography.Text>
      </div>
      <div className="h-56 sm:h-64 md:h-80 w-full">
        <LineChartMargin data={data} />
      </div>
    </CardRoot>
  );
};

export default ReportMarginShortcut;
