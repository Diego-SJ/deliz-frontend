import { LineChartData } from '@/redux/reducers/analytics/types';
import functions from '@/utils/functions';
import { DateRangeKey, formatAxisBottom, formatAxisBottomLabel } from '@/utils/sales-report';
import { ResponsiveLine } from '@nivo/line';
import { Badge } from 'antd';
import numeral from 'numeral';

type Props = {
  data: LineChartData;
  range?: DateRangeKey;
  stacked?: boolean;
  chartStyle?: 'linear' | 'step';
  hideData?: boolean;
};

const countAllitems = (data: LineChartData) => {
  if (!data || !data.length) return 0;
  return data[0].data.length;
};

export const LineChartProfit = ({ data, range, stacked = false, chartStyle = 'linear', hideData = false }: Props) => {
  // const minYValue = Math.min(...data?.flatMap(series => series?.data?.map(point => point.y)));
  // const dynamicBaselineValue = minYValue;

  return (
    <ResponsiveLine
      data={data}
      margin={{ top: 40, right: 20, bottom: 45, left: 50 }}
      xScale={{ type: 'point' }}
      yScale={{
        type: 'linear',
        min: 'auto',
        max: 'auto',
        stacked,
        reverse: false,
      }}
      curve={chartStyle}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legendOffset: 36,
        legendPosition: 'middle',
        legend: formatAxisBottomLabel(range || 'last_7_days'),
        format: (e) => formatAxisBottom(e, countAllitems(data)),
        truncateTickAt: 0,
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: 'Entradas y salidas',
        legendOffset: -40,
        legendPosition: 'middle',
        truncateTickAt: 0,
        format: (e) => (hideData ? '* K' : numeral(e).format('0 a')),
      }}
      legends={[
        {
          anchor: 'top-right',
          direction: 'row',
          justify: false,
          translateX: 0,
          translateY: -45,
          itemsSpacing: 0,
          itemWidth: 100,
          itemHeight: 20,
          itemDirection: 'left-to-right',
          itemOpacity: 0.85,
          symbolSize: 10,
          symbolShape: 'circle',
          effects: [
            {
              on: 'hover',
              style: {
                itemOpacity: 1,
              },
            },
          ],
        },
      ]}
      enableArea
      colors={['#6366F1', '#ef4444']} // [vetas, gastos]
      pointSize={7}
      tooltip={({ point }) => {
        return (
          <div className="bg-white py-2 px-3 shadow-lg rounded-md border">
            <p className="font-base text-xs text-gray-400">{point?.serieId}</p>
            <p className="font-medium text-xl">{functions.money(Number(point?.data?.y))}</p>
            <p className="text-sm text-gray-600">
              <Badge status="success" /> Completado: {functions.money((point?.data as any)?.completed)}
            </p>
            <p className="text-sm text-gray-600">
              <Badge status="warning" /> Pendiente: {functions.money((point?.data as any)?.pending)}
            </p>
          </div>
        );
      }}
      pointColor={{ theme: 'background' }}
      pointBorderWidth={5}
      pointBorderColor={{ from: 'serieColor', modifiers: [] }}
      // pointLabel={e => e.data.x + ': ' + e.data.y}
      // pointLabelYOffset={-12}
      enableTouchCrosshair
      // areaBaselineValue={dynamicBaselineValue}
      areaOpacity={0.2} // Ajusta la opacidad del área
      // areaBlendMode="normal" // Asegura que el área se dibuje debajo de las líneas
      useMesh={true}
      // enableGridX={false}
      // enableGridY={false}
    />
  );
};
