import { ArrowLeft, Printer, ChartLine, ChartColumnBig, Layers2, Layers } from 'lucide-react';
import { Button, Col, Row, Space, Tooltip, Typography } from 'antd';
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
import EyeButton, { useHideData } from '@/components/atoms/eye-button';

const ProfitReport = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { filters, data } = useAppSelector(({ analytics }) => analytics?.profit);
  const [stacked, setStacked] = useState(false);
  const [chartStyle, setChartStyle] = useState<'linear' | 'step'>('linear');
  const elementRef = useRef<any>(null);
  const firstRender = useRef(false);
  const { hideData, handleHideData } = useHideData();

  useEffect(() => {
    if (!firstRender.current) {
      firstRender.current = true;
      dispatch(analyticsActions.profit.getFullDataByFilters());
    }
  }, [firstRender]);

  const handlePrint = useReactToPrint({
    contentRef: elementRef,
  });

  const handleStacked = () => {
    setStacked((prev) => !prev);
  };

  const handleChartStyle = () => {
    setChartStyle((prev) => (prev === 'linear' ? 'step' : 'linear'));
  };

  return (
    <div ref={elementRef} className="print:bg-white print:p-4">
      <div className="flex items-center gap-2 justify-between mb-5">
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
        <Space.Compact>
          <Button
            type="primary"
            className="w-fit"
            icon={<Printer strokeWidth={1.5} className="w-4 h-4" />}
            onClick={() => handlePrint()}
          >
            Imprimir
          </Button>
          <EyeButton type="primary" onChange={handleHideData} hideData={hideData} />
        </Space.Compact>
      </div>
      <ProfitShorcutReport hideData={hideData} />

      <Row gutter={[10, 10]}>
        <Col xs={24}>
          <ProfitsByRange hideData={hideData} />
        </Col>
        <Col xs={24}>
          <CardRoot
            classNames={{ body: '!px-2' }}
            title="Entradas y gastos"
            extra={
              <div className="flex gap-4 print:hidden">
                <Tooltip title={'Cambiar estilo de gráfico'}>
                  <Button
                    onClick={handleChartStyle}
                    icon={
                      chartStyle === 'linear' ? (
                        <ChartColumnBig className="w-4 h-4" />
                      ) : (
                        <ChartLine className="w-4 h-4" />
                      )
                    }
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
              <LineChartProfit
                data={data || []}
                range={filters?.date_range}
                stacked={stacked}
                chartStyle={chartStyle}
                hideData={hideData}
              />
            </div>
          </CardRoot>
        </Col>
      </Row>
    </div>
  );
};

export default ProfitReport;
