import {
  ArrowDown01,
  ArrowLeft,
  ChartColumnBig,
  ChartLine,
  Layers,
  Layers2,
  Printer,
  Shuffle,
} from 'lucide-react';
import { Button, Col, Row, Space, Tooltip, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { APP_ROUTES } from '@/routes/routes';
import { useAppDispatch, useAppSelector } from '@/hooks/useStore';
import { useEffect, useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import { LineChartProfit } from './chart';
import CardRoot from '@/components/atoms/Card';
import { analyticsActions } from '@/redux/reducers/analytics';
import ProfitsByRange from './profits-by-range';
import ProfitReportFilters from '@/components/pages/reports/expenses/full-report/filters';
import ExpensesPieChart from '@/components/pages/reports/expenses/shortcut/chart';
import EyeButton, { useHideData } from '@/components/atoms/eye-button';

const ExpensesFullReport = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { filters, charts } = useAppSelector(
    ({ analytics }) => analytics?.expenses,
  );
  const [stacked, setStacked] = useState(false);
  const [chartStyle, setChartStyle] = useState<'linear' | 'step'>('linear');
  const elementRef = useRef<any>(null);
  const firstRender = useRef(false);
  const [sortByValue, setSortByValue] = useState(false);
  const { handleHideData, hideData } = useHideData();

  useEffect(() => {
    if (!firstRender.current) {
      firstRender.current = true;
      dispatch(analyticsActions.expenses.getExpensesByCategory());
      dispatch(analyticsActions.expenses.getExpensesByDate());
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

  const handleSort = () => {
    setSortByValue((prev) => !prev);
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
              Reporte de gastos
            </Typography.Title>
          </div>
        </div>

        <div className="flex flex-row sm:items-center gap-3 print:hidden">
          <ProfitReportFilters />
          <Space.Compact>
            <Button
              type="primary"
              className="w-fit "
              icon={<Printer strokeWidth={1.5} className="w-4 h-4" />}
              onClick={() => handlePrint()}
            >
              Imprimir
            </Button>
            <EyeButton
              type="primary"
              onChange={handleHideData}
              hideData={hideData}
            />
          </Space.Compact>
        </div>
      </div>

      <Row gutter={[20, 20]}>
        <Col xs={24}>
          <ProfitsByRange discrete={hideData} />
        </Col>
        <Col xs={24} md={24} lg={24} xl={12}>
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
                    icon={
                      stacked ? (
                        <Layers2 className="w-4 h-4" />
                      ) : (
                        <Layers className="w-4 h-4" />
                      )
                    }
                  />
                </Tooltip>
              </div>
            }
          >
            <div className="h-[390px] w-full">
              <LineChartProfit
                data={charts?.line || []}
                range={filters?.date_range}
                stacked={stacked}
                chartStyle={chartStyle}
              />
            </div>
          </CardRoot>
        </Col>
        <Col xs={24} md={24} lg={24} xl={12}>
          <CardRoot
            classNames={{ body: '!px-2' }}
            title="Gastos por categoría"
            extra={
              <Button
                onClick={handleSort}
                icon={
                  sortByValue ? (
                    <Shuffle className="w-4 h-4" />
                  ) : (
                    <ArrowDown01 className="w-4 h-4" />
                  )
                }
              />
            }
          >
            <div className="h-[390px] w-full">
              <ExpensesPieChart
                data={charts?.pieCustom || []}
                sortByValue={sortByValue}
              />
            </div>
          </CardRoot>
        </Col>
      </Row>
    </div>
  );
};

export default ExpensesFullReport;
