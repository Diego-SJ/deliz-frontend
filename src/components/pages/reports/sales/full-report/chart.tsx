import { LineChartData } from '@/redux/reducers/analytics/types';
import { ResponsiveLine } from '@nivo/line';

type Props = {
  data: LineChartData;
};

export const LineChartSales = ({ data }: Props) => {
  const minYValue = Math.min(...data?.flatMap(series => series?.data?.map(point => point.y)));
  const dynamicBaselineValue = minYValue;

  return (
    <ResponsiveLine
      data={data}
      margin={{ top: 10, right: 20, bottom: 25, left: 30 }}
      xScale={{ type: 'point' }}
      yScale={{
        type: 'linear',
        min: 'auto',
        max: 'auto',
        stacked: true,
        reverse: false,
      }}
      curve="monotoneX"
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: null,
        legendOffset: 36,
        legendPosition: 'middle',
        truncateTickAt: 0,
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: null,
        legendOffset: -40,
        legendPosition: 'middle',
        truncateTickAt: 0,
        tickValues: data.reduce((acc: any, series) => {
          series.data.forEach(point => {
            if (!acc.includes(point.y.toString())) {
              acc.push(point.y.toString());
            }
          });
          return acc;
        }, []),
      }}
      enableArea
      colors={'#6366F1'}
      pointSize={7}
      tooltip={function (e) {
        return (
          <div className="bg-white py-2 px-3 shadow-lg rounded-md text-center">
            <p className="font-medium text-xl">{e.point.data.y.toString()}</p>
            <p className="font-base">ventas</p>
          </div>
        );
      }}
      pointColor={{ theme: 'background' }}
      pointBorderWidth={5}
      pointBorderColor={{ from: 'serieColor', modifiers: [] }}
      pointLabel="data.y"
      pointLabelYOffset={-12}
      enableTouchCrosshair={true}
      areaBaselineValue={dynamicBaselineValue}
      areaOpacity={0.2} // Ajusta la opacidad del área
      areaBlendMode="normal" // Asegura que el área se dibuje debajo de las líneas
      useMesh={true}
      enableGridX={false}
      enableGridY={false}
    />
  );
};
