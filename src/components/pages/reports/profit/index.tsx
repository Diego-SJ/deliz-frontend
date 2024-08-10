import { Button } from 'antd';
import { LineChartProfit } from './chart';
import CardRoot from '@/components/atoms/Card';

const ReportProfitThumbnail = () => {
  return (
    <CardRoot
      title="Utilidad"
      extra={
        <Button type="text" className="!text-primary underline">
          Ver reporte
        </Button>
      }
    >
      <div className="h-56 sm:h-64 md:h-80 w-full">
        <LineChartProfit
          data={[
            {
              id: 'this_week',
              data: [
                {
                  x: 'Lun.',
                  y: 87,
                },
                {
                  x: 'Mar.',
                  y: 116,
                },
                {
                  x: 'Mie.',
                  y: 97,
                },
                {
                  x: 'Jue.',
                  y: 168,
                },
                {
                  x: 'Vie.',
                  y: 182,
                },
                {
                  x: 'Sab.',
                  y: 9,
                },
                {
                  x: 'Dom.',
                  y: 42,
                },
              ],
            },
          ]}
        />
      </div>
    </CardRoot>
  );
};

export default ReportProfitThumbnail;
