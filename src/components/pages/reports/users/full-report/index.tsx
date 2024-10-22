import { ArrowDown01, ArrowLeft, Printer, Shuffle } from 'lucide-react';
import { Button, Col, Row, Space, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { APP_ROUTES } from '@/routes/routes';
import { useAppDispatch, useAppSelector } from '@/hooks/useStore';
import { useEffect, useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import CardRoot from '@/components/atoms/Card';
import { analyticsActions } from '@/redux/reducers/analytics';
import ProfitReportFilters from './filters';
import ExpensesPieChart from '@/components/pages/reports/users/shortcut/chart';
import EyeButton, { useHideData } from '@/components/atoms/eye-button';
import functions from '@/utils/functions';

const SalesByUserFullReport = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { charts } = useAppSelector(({ analytics }) => analytics?.users);
  const elementRef = useRef<any>(null);
  const firstRender = useRef(false);
  const [sortByValue, setSortByValue] = useState({ char1: false, char2: false });
  const { handleHideData, hideData } = useHideData();

  useEffect(() => {
    if (!firstRender.current) {
      firstRender.current = true;
      dispatch(analyticsActions.users.getSalesByUser());
    }
  }, [firstRender]);

  const handlePrint = useReactToPrint({
    contentRef: elementRef,
  });

  const handleChartSort = (char: string) => {
    setSortByValue((prev) => {
      return { ...prev, [char]: !prev[char as keyof typeof prev] };
    });
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
              Reporte de ventas por usuario
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
            <EyeButton type="primary" onChange={handleHideData} hideData={hideData} />
          </Space.Compact>
        </div>
      </div>

      <Row gutter={[20, 20]}>
        <Col xs={24} md={24} lg={24} xl={12}>
          <CardRoot
            classNames={{ body: '!px-2' }}
            title="Monto de ventas por usuario"
            extra={
              <Button
                onClick={() => handleChartSort('char1')}
                icon={sortByValue.char1 ? <Shuffle className="w-4 h-4" /> : <ArrowDown01 className="w-4 h-4" />}
              />
            }
          >
            <div className="h-[390px] w-full">
              <ExpensesPieChart
                data={charts?.total_amount || []}
                sortByValue={sortByValue.char1}
                hideData={hideData}
                valueFormatter={(value) => functions.money(value, { hidden: hideData })}
              />
            </div>
          </CardRoot>
        </Col>
        <Col xs={24} md={24} lg={24} xl={12}>
          <CardRoot
            classNames={{ body: '!px-2' }}
            title="Ventas por usuario"
            extra={
              <Button
                onClick={() => handleChartSort('char2')}
                icon={sortByValue.char2 ? <Shuffle className="w-4 h-4" /> : <ArrowDown01 className="w-4 h-4" />}
              />
            }
          >
            <div className="h-[390px] w-full">
              <ExpensesPieChart data={charts?.total_sales || []} sortByValue={sortByValue.char2} hideData={hideData} />
            </div>
          </CardRoot>
        </Col>
      </Row>
    </div>
  );
};

export default SalesByUserFullReport;
