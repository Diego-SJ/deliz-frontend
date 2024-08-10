import { ResponsiveLine } from '@nivo/line';

type Data = {
  id: string | number;
  color?: string;
  data: {
    x: number | string | Date;
    y: number | string | Date;
  }[];
}[];

type Props = {
  data: Data;
};
// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.
export const LineChartProfit = ({ data }: Props) => (
  <ResponsiveLine
    data={data}
    margin={{ top: 10, right: 10, bottom: 20, left: 30 }}
    xScale={{ type: 'point' }}
    yScale={{
      type: 'linear',
      min: 'auto',
      max: 'auto',
      stacked: true,
      reverse: false,
    }}
    yFormat=" >-.2f"
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
    }}
    enableArea
    colors={'#6366F1'}
    pointSize={7}
    pointColor={{ theme: 'background' }}
    pointBorderWidth={5}
    pointBorderColor={{ from: 'serieColor', modifiers: [] }}
    pointLabel="data.y"
    pointLabelYOffset={-12}
    enableTouchCrosshair={true}
    areaBaselineValue={10}
    areaBlendMode="multiply"
    useMesh={true}
  />
);
