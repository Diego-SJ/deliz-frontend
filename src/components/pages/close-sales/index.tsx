import { APP_ROUTES } from '@/routes/routes';
import { useAppDispatch, useAppSelector } from '@/hooks/useStore';
import functions from '@/utils/functions';
import { CheckCircleOutlined, ReloadOutlined } from '@ant-design/icons';
import { Breadcrumb, Button, Card, Col, DatePicker, Row, Tooltip, message, Typography, Modal } from 'antd';
import Table, { ColumnsType } from 'antd/es/table';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { salesActions } from '@/redux/reducers/sales';
import { CashClosing } from '@/redux/reducers/sales/types';
import TextArea from 'antd/es/input/TextArea';

const columns: ColumnsType<CashClosing> = [
  { title: '#', dataIndex: 'cash_closing_id', width: 50, align: 'center' },
  {
    title: 'Ventas',
    width: 120,
    align: 'center',
    dataIndex: 'total_sales',
  },
  {
    title: 'Monto',
    width: 130,
    align: 'center',
    dataIndex: 'amount',
    render: (value = 0) => {
      return functions.money(value);
    },
  },
  {
    title: 'Fecha de cierre',
    dataIndex: 'closing_date',
    align: 'center',
    width: 210,
    render: (value: Date | string) => functions.date(value),
  },
  {
    title: 'Comentarios',
    dataIndex: 'description',
    align: 'left',
  },
];

const { Title } = Typography;

const CloseSales = () => {
  const dispatch = useAppDispatch();
  const { closing_days } = useAppSelector(({ sales }) => sales);
  const [auxSales, setAuxSales] = useState<CashClosing[]>([]);
  const [open, setOpen] = useState(false);
  const [comments, setComments] = useState('');
  const [filters, setFilters] = useState({ startDate: '', endDate: '', status: 0 });
  const isFirstRender = useRef(true);
  const [totalSaleAmount, setTotalSaleAmount] = useState(0);
  const [totalSales, setTotalSales] = useState(0);
  const [loading, setLoading] = useState(false);
  const { data = [], today_is_done = false } = closing_days || { data: [] };

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      dispatch(salesActions.fetchClosedDays());
      return;
    }
  }, [dispatch]);

  useEffect(() => {
    setAuxSales(data);
  }, [data]);

  useEffect(() => {
    let totalAmounts = auxSales?.reduce((acc, item) => {
      return (item?.amount || 0) + acc;
    }, 0);
    let totalSale = auxSales?.reduce((acc, item) => {
      return (item?.total_sales || 0) + acc;
    }, 0);
    setTotalSales(totalSale);
    setTotalSaleAmount(totalAmounts);
  }, [auxSales]);

  const applyFilters = ({ status, endDate, startDate }: { status?: number; endDate?: string; startDate?: string }) => {
    if (!status && !startDate && !endDate) {
      setAuxSales(data);
    } else {
      let salesList = data?.filter(item => {
        let matchDate1 = !!startDate ? functions.dateAfter(item?.closing_date as string, startDate) : true;
        let matchDate2 = !!endDate ? functions.dateBefore(item?.closing_date as string, endDate) : true;
        return matchDate1 && matchDate2;
      });
      setAuxSales(salesList);
    }
  };

  useEffect(() => {
    applyFilters(filters);
  }, [filters]);

  const onRowClick = (record: CashClosing) => {};

  const onRefresh = async () => {
    const result = await dispatch(salesActions.fetchClosedDays({ refetch: true }));
    if (result) message.info('Información actualizada');
  };

  const closeModal = () => {
    setComments('');
    setOpen(false);
  };

  const onFinishDay = async () => {
    setLoading(true);
    await dispatch(salesActions.closeDay(comments));
    closeModal();
    setLoading(false);
  };

  return (
    <>
      <Row justify="space-between" align="middle">
        <Col lg={{ span: 12 }}>
          <Breadcrumb
            items={[
              {
                title: <Link to={APP_ROUTES.PRIVATE.DASHBOARD.HOME.path}>Dashboard</Link>,
                key: 'dashboard',
              },
              { title: 'Cierres de ventas' },
            ]}
          />
        </Col>
      </Row>
      <Row style={{ marginTop: '10px' }}>
        <Col span={24}>
          <Card bodyStyle={{ padding: '10px' }} style={{ marginBottom: 10 }}>
            <Row gutter={[10, 10]}>
              <Col lg={6} xs={12}>
                <DatePicker
                  size="large"
                  placeholder="Inicio"
                  style={{ width: '100%' }}
                  onChange={(_, startDate) => setFilters(p => ({ ...p, startDate }))}
                />
              </Col>
              <Col lg={6} xs={12}>
                <DatePicker
                  size="large"
                  placeholder="Fin"
                  style={{ width: '100%' }}
                  onChange={(_, startDate) => setFilters(p => ({ ...p, startDate }))}
                />
              </Col>
              {!today_is_done && (
                <Col lg={{ span: 6, offset: 6 }} xs={{ offset: 0, span: 12 }}>
                  <Button size="large" block type="primary" icon={<CheckCircleOutlined rev={{}} />} onClick={() => setOpen(true)}>
                    Cerrar día
                  </Button>
                </Col>
              )}
            </Row>
          </Card>
          <Table
            onRow={record => {
              return {
                onClick: () => onRowClick(record), // click row
              };
            }}
            size="small"
            columns={columns}
            dataSource={auxSales}
            rowKey={item => `${item.cash_closing_id}`}
            scroll={{ x: 700 }}
            footer={() => (
              <Row gutter={[10, 10]}>
                <Col lg={{ span: 6 }} md={{ span: 8, offset: 0 }} xs={{ span: 24 }}>
                  <Tooltip title="Recargar">
                    <Button type="default" size="large" icon={<ReloadOutlined rev={{}} />} onClick={onRefresh}>
                      Recargar
                    </Button>
                  </Tooltip>
                </Col>
                <Col
                  lg={{ span: 6, offset: 6 }}
                  md={{ span: 8, offset: 0 }}
                  xs={{ span: 24, offset: 0 }}
                  style={{ display: 'flex', alignItems: 'center' }}
                >
                  <Title style={{ textAlign: 'end', margin: 0 }} level={5}>
                    Ventas: {totalSales}
                  </Title>
                </Col>
                <Col
                  lg={{ span: 6, offset: 0 }}
                  md={{ span: 8, offset: 0 }}
                  xs={{ span: 24, offset: 0 }}
                  style={{ display: 'flex', alignItems: 'center' }}
                >
                  <Title style={{ textAlign: 'end', margin: '0 10px 0 0' }} level={5}>
                    Monto total: {functions?.money(totalSaleAmount)}
                  </Title>
                </Col>
              </Row>
            )}
          />
        </Col>
      </Row>

      <Modal
        open={open}
        maskClosable={false}
        width={350}
        destroyOnClose
        onCancel={closeModal}
        footer={[
          <Row key="actions" gutter={10}>
            <Col span={12}>
              <Button size="large" key="back" block onClick={closeModal} loading={loading}>
                Cancelar
              </Button>
            </Col>
            <Col span={12}>
              <Button size="large" block type="primary" onClick={onFinishDay} loading={loading}>
                Guardar
              </Button>
            </Col>
          </Row>,
        ]}
      >
        <Title level={5} style={{}}>
          Comentarios (opcional)
        </Title>
        <TextArea onChange={({ target }) => setComments(target.value)} />
      </Modal>
    </>
  );
};

export default CloseSales;
