import { ResponsivePie } from '@nivo/pie';
import { PieChartItem } from '@/types/charts';
import functions from '@/utils/functions';
import EmptyChart from '@/components/atoms/empty-chart';

type Props = {
  data?: PieChartItem[];
  sortByValue?: boolean;
  hideData?: boolean;
  valueFormatter?: (value: number) => string;
};

const ExpensesPieChart = ({ data = [], sortByValue = false, valueFormatter, hideData }: Props) => (
  <>
    {data?.length ? (
      <ResponsivePie
        data={data}
        margin={{ top: 40, right: -20, bottom: 30, left: 70 }}
        sortByValue={sortByValue}
        padAngle={1.5}
        innerRadius={0.5}
        cornerRadius={5}
        motionConfig="wobbly"
        activeOuterRadiusOffset={8}
        tooltip={(e) => (
          <div className="bg-white p-3 shadow-lg border rounded-xl">
            <h5 className="mb-1 font-light text-gray-400">{e?.datum?.data?.label}</h5>
            <p className="font-medium text-xl">
              {!!valueFormatter
                ? hideData
                  ? '*****'
                  : valueFormatter(e?.datum?.value as number)
                : functions.number(e?.datum?.value as number, { hidden: hideData })}
            </p>
          </div>
        )}
        colors={['#d9f99d', '#6ee7b7', '#7dd3fc', '#a5b4fc', '#f5d0fe']}
        borderWidth={1}
        borderColor={{
          from: 'color',
          modifiers: [['darker', 0.5]],
        }}
        arcLinkLabelsSkipAngle={10}
        arcLinkLabelsTextColor="#333333"
        arcLinkLabelsDiagonalLength={8}
        arcLinkLabelsThickness={2}
        arcLinkLabelsColor={{ from: 'color' }}
        arcLinkLabel={(e) => e.data?.label}
        arcLabel={(e) => {
          return !!valueFormatter
            ? valueFormatter(e?.value as number)
            : `${functions.number(e.value as number, { hidden: hideData })}`;
        }}
        enableArcLabels={!hideData}
        arcLabelsSkipAngle={10}
        legends={[
          {
            anchor: 'bottom-left',
            direction: 'column',
            justify: false,
            translateX: -60,
            translateY: -20,
            itemsSpacing: 0,
            itemWidth: 100,
            itemHeight: 12,
            itemTextColor: '#999',
            itemDirection: 'left-to-right',
            itemOpacity: 1,
            symbolSize: 8,
            symbolShape: 'circle',
          },
        ]}
      />
    ) : (
      <EmptyChart />
    )}
  </>
);

export default ExpensesPieChart;
