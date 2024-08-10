import { Button, Typography } from 'antd';
import { LineChartSales } from './chart';
import CardRoot from '@/components/atoms/Card';
import { formattedDateRange } from '../utils';
import { useAppDispatch, useAppSelector } from '@/hooks/useStore';
import { analyticsActions } from '@/redux/reducers/analytics';

const ReportSaleThumbnail = () => {
  const dispatch = useAppDispatch();
  const { total, loading, data } = useAppSelector(({ analytics }) => analytics?.sales || {});

  return (
    <CardRoot
      loading={loading}
      title={<h5 className="!text-base m-0 font-medium">Ventas</h5>}
      extra={
        <Button type="text" className="!text-primary underline" onClick={() => dispatch(analyticsActions.getSales())}>
          Actualizar
        </Button>
      }
      classNames={{ body: '!px-4 !pt-2' }}
    >
      <div className="flex justify-between items-center mb-2 pl-1 pr-2">
        <Typography.Title level={2} className="!text-3xl !m-0">
          {total || 0}
        </Typography.Title>

        <Typography.Text className="!text-sm mt-2">{formattedDateRange}</Typography.Text>
      </div>
      <div className="h-56 sm:h-64 md:h-80 w-full">
        <LineChartSales data={data} />
      </div>
    </CardRoot>
  );
};

export default ReportSaleThumbnail;
