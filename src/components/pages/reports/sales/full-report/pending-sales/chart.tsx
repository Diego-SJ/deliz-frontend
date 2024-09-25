import { BarChartDataItem } from '@/redux/reducers/analytics/types';
import { DateRangeKey, formatAxisBottom, formatAxisBottomLabel } from '@/utils/sales-report';
import { ResponsiveBar } from '@nivo/bar';
import dayjs from 'dayjs';
import numeral from 'numeral';

type Props = {
  data: BarChartDataItem[];
  range?: DateRangeKey;
  axisLeft?: {
    legend: string;
  };
};

// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.
const PendingSalesChart = ({ data = [], axisLeft, range }: Props) => (
  <ResponsiveBar
    data={data}
    keys={['Pendiente', 'Pagado']}
    indexBy="date"
    margin={{ top: 50, right: 0, bottom: 40, left: 50 }}
    padding={0.13}
    valueScale={{ type: 'linear' }}
    indexScale={{ type: 'band', round: true }}
    colors={['#B1E619', '#6366F1']}
    borderRadius={3}
    borderColor={{
      from: 'color',
      modifiers: [['darker', 0.9]],
    }}
    axisTop={null}
    axisRight={null}
    // label={e => numeral(e.value).format('$0,0.00')}
    axisBottom={{
      tickSize: 5,
      tickPadding: 5,
      tickRotation: 0,
      legend: formatAxisBottomLabel(range || 'last_7_days'),
      legendPosition: 'middle',
      legendOffset: 32,
      truncateTickAt: 0,
      format: e => formatAxisBottom(e, data.length),
    }}
    axisLeft={{
      tickSize: 5,
      tickPadding: 5,
      tickRotation: 0,
      legend: 'Monto',
      legendPosition: 'middle',
      legendOffset: -40,
      truncateTickAt: 0,
      format: e => numeral(e).format('$0 a'),
    }}
    enableTotals={true}
    enableLabel={false}
    valueFormat={e => numeral(e).format('$0,0')}
    totalsOffset={4}
    labelSkipWidth={9}
    labelSkipHeight={12}
    labelTextColor="#ffffff"
    legends={[
      {
        dataFrom: 'keys',
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
        symbolSize: 6,
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
    tooltip={function (e) {
      return (
        <div className="bg-white py-2 px-3 shadow-lg rounded-md text-center">
          <p className="font-medium text-base">{numeral(e.formattedValue).format('$0,0.00')}</p>
          <p className="font-base text-xs">{dayjs(e.data?.date).format('dddd D MMMM, YYYY')}</p>
        </div>
      );
    }}
    role="application"
    ariaLabel="Pendings vs Completed"
    barAriaLabel={e => e.id + ': ' + e.formattedValue + ' in date: ' + e.indexValue}
  />
);

export default PendingSalesChart;
