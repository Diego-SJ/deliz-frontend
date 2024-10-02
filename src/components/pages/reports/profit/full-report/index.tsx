import { ArrowLeft, Printer, ChartColumnStacked, ChartLine, ChartColumnBig, Layers2, Layers } from 'lucide-react';
import { Button, Col, Row, Tooltip, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { APP_ROUTES } from '@/routes/routes';
import { useAppDispatch, useAppSelector } from '@/hooks/useStore';
import { useEffect, useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import { LineChartProfit } from './chart';
import CardRoot from '@/components/atoms/Card';
import { analyticsActions } from '@/redux/reducers/analytics';
import ProfitShorcutReport from './total-profits';
import ProfitsByRange from './profits-by-range';

const ProfitReport = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { filters, data } = useAppSelector(({ analytics }) => analytics.profit);
  const [stacked, setStacked] = useState(false);
  const [chartStyle, setChartStyle] = useState<'linear' | 'step'>('linear');
  const elementRef = useRef<any>(null);
  const firstRender = useRef(false);

  useEffect(() => {
    if (!firstRender.current) {
      firstRender.current = true;
      dispatch(analyticsActions.profit.getFullDataByFilters());
    }
  }, [firstRender]);

  const handlePrint = useReactToPrint({
    content: () => elementRef.current,
  });

  const handleStacked = () => {
    setStacked(prev => !prev);
  };

  const handleChartStyle = () => {
    setChartStyle(prev => (prev === 'linear' ? 'step' : 'linear'));
  };

  return (
    <div ref={elementRef} className="print:bg-white print:p-4">
      <div className="flex gap-5 flex-col lg:flex-row lg:justify-between lg:items-center mb-5">
        <div className="flex items-center gap-2 justify-between">
          <div className="flex gap-3 items-center">
            <Button
              className="print:hidden"
              icon={<ArrowLeft strokeWidth={1.5} className="w-4 h-4" />}
              onClick={() => navigate(APP_ROUTES.PRIVATE.REPORTS.path)}
            />
            <Typography.Title level={4} className="!m-0">
              Reporte de ganancias
            </Typography.Title>
          </div>
          <Button
            type="primary"
            className="w-fit sm:hidden"
            icon={<Printer strokeWidth={1.5} className="w-4 h-4" />}
            onClick={handlePrint}
          >
            Imprimir
          </Button>
        </div>
        <div className="flex flex-col-reverse sm:flex-row sm:items-center gap-3 print:hidden">
          <Button
            type="primary"
            className="w-fit hidden sm:inline-flex"
            icon={<Printer strokeWidth={1.5} className="w-4 h-4" />}
            onClick={handlePrint}
          >
            Imprimir
          </Button>
        </div>
      </div>
      <ProfitShorcutReport />

      <Row gutter={[10, 10]}>
        <Col xs={24}>
          <ProfitsByRange />
        </Col>
        <Col xs={24}>
          <CardRoot
            classNames={{ body: '!px-2' }}
            title="Ventas"
            extra={
              <div className="flex gap-4 print:hidden">
                <Tooltip title={'Cambiar estilo de gráfico'}>
                  <Button
                    onClick={handleChartStyle}
                    icon={chartStyle === 'linear' ? <ChartColumnBig className="w-4 h-4" /> : <ChartLine className="w-4 h-4" />}
                  />
                </Tooltip>

                <Tooltip title={stacked ? 'Sin apilar' : 'Apilar'}>
                  <Button
                    onClick={handleStacked}
                    icon={stacked ? <Layers2 className="w-4 h-4" /> : <Layers className="w-4 h-4" />}
                  />
                </Tooltip>
              </div>
            }
          >
            <div className="h-[390px] w-full">
              <LineChartProfit data={data} range={filters?.date_range} stacked={stacked} chartStyle={chartStyle} />
            </div>
          </CardRoot>
        </Col>
      </Row>
    </div>
  );
};

export default ProfitReport;
