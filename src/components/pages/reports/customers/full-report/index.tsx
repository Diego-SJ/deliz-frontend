import EyeButton, { useHideData } from '@/components/atoms/eye-button';
import { APP_ROUTES } from '@/routes/routes';
import { Button, Col, Dropdown, Row, Space, Typography } from 'antd';
import { ArrowLeft, LandPlot, Printer, RefreshCw, UserCheck, Users, UserX } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import CustomerList from './customer-list';
import { useAppDispatch, useAppSelector } from '@/hooks/useStore';
import CardRoot from '@/components/atoms/Card';
import { analyticsActions } from '@/redux/reducers/analytics';
import SaleInsight from '@/components/organisms/SaleReports/sale-insight';
import functions from '@/utils/functions';
import CustomersFilters from './filters';
import LastCustomers from './last-customers';
import { SortAscendingOutlined } from '@ant-design/icons';
import { DATE_REANGE_NAMES } from '@/constants/catalogs';
import PendingCustomerList from './pending-customer-list';

const CustomersFullReport = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const elementRef = useRef<HTMLDivElement>(null);
  const { handleHideData, hideData } = useHideData();
  const { top_customers, last_customer_sales, total_customers, loading, debtor_customers } = useAppSelector(
    ({ analytics }) => analytics?.customers || {},
  );
  const mounted = useRef(false);

  useEffect(() => {
    if (!top_customers?.length) {
      dispatch(analyticsActions.getTopCustomers());
    }
  }, [dispatch]);

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      dispatch(analyticsActions.customers.getLastCustomerSales());
      dispatch(analyticsActions.customers.getTotalCustomers());
      dispatch(analyticsActions.customers.getDebtorCustomers());
    }
  }, [dispatch, mounted]);

  const handlePrint = useReactToPrint({
    contentRef: elementRef,
  });

  const handleSort = async (value: string) => {
    dispatch(
      analyticsActions.setCustomerSalesFilters({
        order_by: value,
      }),
    );
    await functions.sleep(100);
    dispatch(analyticsActions.customers.getLastCustomerSales());
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
              Reporte de clientes
            </Typography.Title>
          </div>
        </div>

        <div className="flex flex-row sm:items-center gap-3 print:hidden">
          <CustomersFilters />
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

      <Row gutter={[10, 10]} className="!mb-3">
        <Col xs={24} md={12} lg={6}>
          <SaleInsight
            icon={<Users className="text-indigo-600" />}
            title="Total de clientes"
            value={functions.number(total_customers, {
              hidden: hideData,
            })}
          />
        </Col>
        <Col xs={24} md={12} lg={6}>
          <SaleInsight
            icon={<UserCheck className="text-indigo-600" />}
            title="Clientes activos"
            value={functions.number(last_customer_sales?.data?.length, {
              hidden: hideData,
            })}
          />
        </Col>
        <Col xs={24} md={12} lg={6}>
          <SaleInsight
            icon={<LandPlot className="text-indigo-600" />}
            title="% de clientes activos"
            value={
              functions.number((last_customer_sales?.data?.length / total_customers) * 100, {
                hidden: hideData,
              }) + '%'
            }
          />
        </Col>
        <Col xs={24} md={12} lg={6}>
          <SaleInsight
            icon={<UserX className="text-indigo-600" />}
            title="Clientes con pagos pendientes"
            value={functions.number(debtor_customers?.total, { hidden: hideData })}
          />
        </Col>
      </Row>

      <Row gutter={[10, 10]}>
        <Col xs={24} lg={12}>
          <CardRoot
            classNames={{ body: '!py-2 !px-5' }}
            title={<h5 className="!text-base m-0 font-medium">Los 10 mejores clientes</h5>}
          >
            <CustomerList data={top_customers} hideData={hideData} />
          </CardRoot>
        </Col>
        <Col xs={24} lg={12}>
          <CardRoot
            classNames={{ body: '!py-2 !px-5' }}
            title={<h5 className="!text-base m-0 font-medium">Clientes con pagos pendientes</h5>}
            extra={
              <Button
                icon={<RefreshCw className="w-4" />}
                onClick={() => dispatch(analyticsActions.customers.getDebtorCustomers())}
              />
            }
          >
            <PendingCustomerList data={debtor_customers?.data} hideData={hideData} />
          </CardRoot>
        </Col>
        <Col xs={24} lg={12}>
          <CardRoot
            classNames={{ body: '!py-2 !px-5' }}
            title={<h5 className="!text-base m-0 font-medium">Resumen de clientes</h5>}
            extra={
              <>
                <Dropdown
                  className="print:hidden"
                  menu={{
                    selectedKeys: [last_customer_sales?.filters?.order_by || 'total_amount,desc'],
                    selectable: true,
                    items: [
                      {
                        label: 'Monto total (mayor a menor)',
                        key: 'total_amount,desc',
                      },
                      {
                        label: 'Monto total (menor a mayor)',
                        key: 'total_amount,asc',
                      },
                      {
                        label: 'Número de compras (mayor a menor)',
                        key: 'total_sales,desc',
                      },
                      {
                        label: 'Número de compras (menor a mayor)',
                        key: 'total_sales,asc',
                      },
                    ],
                    onClick: ({ key }) => handleSort(key),
                  }}
                >
                  <Button icon={<SortAscendingOutlined />} loading={loading}>
                    Ordenar
                  </Button>
                </Dropdown>
                <span className="hidden print:!inline-flex text-slate-700">
                  {DATE_REANGE_NAMES[last_customer_sales?.filters?.date_range || 'last_7_days']}
                </span>
              </>
            }
          >
            <LastCustomers data={last_customer_sales?.data || []} hideData={hideData} />
          </CardRoot>
        </Col>
      </Row>
    </div>
  );
};

export default CustomersFullReport;
