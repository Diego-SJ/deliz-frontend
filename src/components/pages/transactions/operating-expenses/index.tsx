import { APP_ROUTES } from '@/routes/routes';
import { useAppDispatch, useAppSelector } from '@/hooks/useStore';
import functions from '@/utils/functions';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { Avatar, Breadcrumb, Button, Col, Drawer, Input, Row, Tag } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Table from '@/components/molecules/Table';
import DeleteButton from '@/components/molecules/Table/delete-btn';
import useMediaQuery from '@/hooks/useMediaQueries';
import ExpenseEditor from './editor';
import { salesActions } from '@/redux/reducers/sales';
import { OperatingExpense } from '@/redux/reducers/sales/types';

type DataType = OperatingExpense;

const columns: ColumnsType<DataType> = [
  // {
  //   title: '',
  //   dataIndex: 'expense_name',
  //   width: 55,
  //   render: value => <Avatar size="large">{value.substring(0, 2)}</Avatar>,
  // },
  {
    title: 'Gasto',
    dataIndex: 'expense_name',
    width: 200,
    render: text => <p style={{ fontWeight: 'bold' }}>{text}</p>,
  },
  {
    title: 'Monto',
    dataIndex: 'amount',
    width: 120,
    render: value => <span>{functions.moneySimple(value)}</span>,
  },

  {
    title: 'M. Pago',
    dataIndex: 'payment_method',
    width: 100,
    render: value => {
      return <Tag color={functions.getTagColor(value)}>{value}</Tag>;
    },
  },
  {
    title: 'MSI',
    dataIndex: 'months_without_interest',
    width: 100,
    render: value => {
      return <span>{value || 0} MSI</span>;
    },
  },
  {
    title: 'Descripción',
    dataIndex: 'description',
    width: 340,
    render: value => <span>{value || '- - -'}</span>,
  },
  {
    title: 'Fecha creación',
    dataIndex: 'created_at',
    width: 150,
    render: created_at => {
      const date = functions.tableDate(created_at);
      return <span>{date}</span>;
    },
  },
  {
    title: 'Acciones',
    dataIndex: 'expense_id',
    width: 150,
    render: (id: number, record) => {
      return (
        <DeleteButton
          deleteFunction={salesActions.operating_expenses.delete(id)}
          editFunction={salesActions.operating_expenses.edit(record)}
        />
      );
    },
  },
];

const OperatingExpenses = () => {
  const dispatch = useAppDispatch();
  const { isTablet } = useMediaQuery();
  const { operating_expenses } = useAppSelector(({ sales }) => sales);
  const [options, setOptions] = useState<OperatingExpense[]>([]);
  const [total, setTotal] = useState(0);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      dispatch(salesActions.operating_expenses.get({ refetch: true }));
      return;
    }
  }, [dispatch]);

  useEffect(() => {
    setOptions(operating_expenses?.data || []);
  }, [operating_expenses?.data]);

  useEffect(() => {
    let _total = options?.reduce((total, item) => {
      return item?.amount + total;
    }, 0);
    setTotal(_total);
  }, [options]);

  const onAddNew = () => {
    dispatch(salesActions.setExpense({ drawer: 'new' }));
  };

  const getPanelValue = ({ searchText }: { searchText?: string }) => {
    let _options = operating_expenses?.data?.filter(item => {
      return functions.includes(item.expense_name, searchText) || functions.includes(item.description, searchText);
    });
    setOptions(_options || []);
  };

  const onRefresh = () => {
    dispatch(salesActions.operating_expenses.get({ refetch: true }));
  };

  const onClose = () => {
    dispatch(salesActions.setExpense({ selected: {} as OperatingExpense, drawer: null }));
  };

  return (
    <div>
      <Row justify="space-between" align="middle">
        <Col span={8} xs={24}>
          <Breadcrumb
            items={[
              {
                title: <Link to={APP_ROUTES.PRIVATE.DASHBOARD.HOME.path}>Dashboard</Link>,
                key: 'dashboard',
              },
              {
                title: <Link to={APP_ROUTES.PRIVATE.DASHBOARD.PRODUCTS.path}>Cortes</Link>,
                key: 'products',
              },
              { title: 'Gastos operativos' },
            ]}
          />
        </Col>
      </Row>
      <Row style={{ marginTop: '10px' }}>
        <Col span={24}>
          <Row gutter={[10, 10]} style={{ marginBottom: 20 }}>
            <Col lg={6} xs={24}>
              <Input
                placeholder="Buscar elemento"
                style={{ width: '100%' }}
                allowClear
                onChange={({ target }) => getPanelValue({ searchText: target.value })}
                prefix={<SearchOutlined rev={{}} />}
              />
            </Col>
            <Col lg={{ span: 6, offset: 12 }} xs={{ offset: 0, span: 24 }}>
              <Button block type="primary" icon={<PlusOutlined rev={{}} />} onClick={onAddNew}>
                Nuevo gasto
              </Button>
            </Col>
          </Row>
          <Table
            size="small"
            scroll={{ y: 'calc(100vh - 300px)', x: 700 }}
            columns={columns}
            onRefresh={onRefresh}
            totalItems={operating_expenses?.data?.length}
            dataSource={options}
            totalAmount={total}
          />
          <Drawer
            title={operating_expenses?.drawer === 'edit' ? 'Editar gasto' : 'Agregar nuevo gasto'}
            width={isTablet ? 350 : 420}
            onClose={onClose}
            open={!!operating_expenses?.drawer}
            styles={{ body: { paddingBottom: 80 } }}
            destroyOnClose
          >
            <ExpenseEditor onSuccess={onClose} />
          </Drawer>
        </Col>
      </Row>
    </div>
  );
};

export default OperatingExpenses;
