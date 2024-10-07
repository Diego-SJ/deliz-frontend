import { ResponsivePie } from '@nivo/pie';
import { PieChartItem } from '@/types/charts';
import functions from '@/utils/functions';
import EmptyChart from '@/components/atoms/empty-chart';

type Props = {
  data?: PieChartItem[];
  sortByValue?: boolean;
};

const ExpensesPieChart = ({ data = [], sortByValue = false }: Props) => (
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
            <h5 className="mb-1 font-light text-gray-400">
              {e?.datum?.data?.label}
            </h5>
            <p className="font-medium text-xl">
              {functions.money(e?.datum?.data?.value)}
            </p>
          </div>
        )}
        colors={[
          // '#FBFFFF',
          // '#F3F7FF',
          // '#EBEFFF',
          // '#E3E7FF',
          // '#DBDFFE',
          '#D3D7FE',
          '#CBCFFD',
          '#C3C7FD',
          '#BBBFFC',
          '#B3B6FB',
          '#ABAEFA',
          '#A3A6F9',
          '#9B9EF8',
          '#9396F7',
          '#8B8EF6',
          '#8386F5',
          '#7B7EF4',
          '#7376F3',
          '#6B6EF2',
          '#6366F1', // Color base
          '#5A5CE0',
          '#5152CF',
          '#4848BE',
          '#3F3EAD',
          '#36349C',
          '#2D2A8B',
          '#24207A',
          '#1B1669',
          '#120C58',
          '#090247', // Color más fuerte al final
        ]}
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
        // arcLabel="value"
        enableArcLabels={false}
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
