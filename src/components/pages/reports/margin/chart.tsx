import { LineChartData } from '@/redux/reducers/analytics/types';
import functions from '@/utils/functions';
import { ResponsiveLine } from '@nivo/line';

type Props = {
  data: LineChartData;
};

export const LineChartMargin = ({ data }: Props) => {
  const minYValue = Math.min(...data?.flatMap(series => series?.data?.map(point => point.y)));
  const dynamicBaselineValue = minYValue;

  // Suponiendo que la serie de totales ya está incluida en "data"
  // Si no, puedes agregarla manualmente como en este ejemplo:
  const totalSalesData = {
    id: 'Total Sales',
    color: 'hsl(220, 70%, 50%)', // Puedes cambiar el color según lo necesites
    data: data[0]?.data.map((point, index) => ({
      x: point.x, // Mismo valor de "x" que la serie principal
      y: point.total, // Valor del total de ventas para ese día
    })),
  };

  // Añade la nueva serie de datos al array `data`
  const updatedData = [...data, totalSalesData];

  return (
    <ResponsiveLine
      data={updatedData} // Utiliza los datos actualizados con la nueva serie
      margin={{ top: 10, right: 20, bottom: 25, left: 53 }}
      xScale={{ type: 'point' }}
      yScale={{
        type: 'linear',
        min: 'auto',
        max: 'auto',
        stacked: true,
        reverse: false,
      }}
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
      curve="monotoneX"
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: null,
        legendOffset: -40,
        legendPosition: 'middle',
        truncateTickAt: 0,
        tickValues: updatedData
          .reduce((acc: any, series) => {
            series.data.forEach(point => {
              if (!acc.includes(point.y.toString())) {
                acc.push(point.y.toString());
              }
            });
            return acc;
          }, [])
          .sort((a: any, b: any) => a - b),
      }}
      enableArea
      colors={{ datum: 'color' }} // Colores según cada serie
      pointSize={7}
      tooltip={function (e) {
        return (
          <div className="bg-white py-2 px-3 shadow-lg rounded-md text-center">
            <p className="font-medium text-xl">{functions.money(e.point.data.y.toString())}</p>
            <p className="font-base">En ventas</p>
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
