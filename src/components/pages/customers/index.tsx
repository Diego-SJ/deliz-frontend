import { APP_ROUTES } from '@/routes/routes';
import { useAppDispatch, useAppSelector } from '@/hooks/useStore';
import functions from '@/utils/functions';
import { PlusCircleOutlined } from '@ant-design/icons';
import { Avatar, Breadcrumb, Button, Col, Drawer, Input, Row } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Customer } from '@/redux/reducers/customers/types';
import { customerActions } from '@/redux/reducers/customers';
import CustomerEditor from './editor';
import useMediaQuery from '@/hooks/useMediaQueries';
import Table from '@/components/molecules/Table';
import CardRoot from '@/components/atoms/Card';

type DataType = Customer;

const columns: ColumnsType<DataType> = [
  {
    title: 'Nombre',
    dataIndex: 'name',
    render: text => {
      return (
        <div className="flex items-center gap-4 pl-4">
          <Avatar className="bg-primary/10 text-primary font-semibold">{text.charAt(0)}</Avatar>
          <p className="m-0 ">{text}</p>
        </div>
      );
    },
  },
  { title: 'Dirección', dataIndex: 'address' },
  { title: 'Teléfono', dataIndex: 'phone' },
  { title: 'Correo', dataIndex: 'email' },
];

const Customers = () => {
  const dispatch = useAppDispatch();
  const [options, setOptions] = useState<Customer[]>([]);
  const { customers, current_customer } = useAppSelector(({ customers }) => customers);
  const { isTablet } = useMediaQuery();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      dispatch(customerActions.fetchCustomers({ refetch: true }));
      return;
    }
  }, [dispatch]);

  useEffect(() => {
    setOptions(customers);
  }, [customers]);

  const onAddNew = () => {
    dispatch(customerActions.setCurrentCustomer({ customer_id: -1 } as Customer));
  };

  const onRowClick = (record: DataType) => {
    dispatch(customerActions.setCurrentCustomer(record));
  };

  const onClose = (success?: boolean) => {
    if (success) dispatch(customerActions.setCurrentCustomer({} as Customer));
  };

  const getPanelValue = useCallback(
    ({ searchText }: { searchText?: string }) => {
      let _options = customers?.filter(item => {
        return (
          functions.includes(item.name, searchText) ||
          functions.includes(item.phone, searchText) ||
          functions.includes(item.address, searchText)
        );
      });
      setOptions(_options);
    },
    [customers],
  );

  const onRefresh = () => {
    dispatch(customerActions.fetchCustomers({ refetch: true }));
  };

  return (
    <div className="max-w-[1200px] mx-auto">
      <Row justify="space-between" align="middle">
        <Col span={24}>
          <Breadcrumb
            items={[
              {
                title: <Link to={APP_ROUTES.PRIVATE.DASHBOARD.HOME.path}>Dashboard</Link>,
                key: 'dashboard',
              },
              { title: 'Clientes' },
            ]}
          />
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Row gutter={[10, 10]} className="mt-3 mb-6">
            <Col lg={{ span: 6 }} sm={18} xs={24}>
              <Input
                placeholder="Buscar por nombre, telefono o dirección"
                style={{ width: '100%' }}
                allowClear
                onChange={({ target }) => getPanelValue({ searchText: target.value })}
              />
            </Col>
            <Col lg={{ span: 4, offset: 14 }} sm={{ span: 6 }} xs={{ span: 24 }}>
              <Button block type="primary" icon={<PlusCircleOutlined />} onClick={onAddNew}>
                Nuevo
              </Button>
            </Col>
          </Row>
          <CardRoot styles={{ body: { padding: 0, overflow: 'hidden' } }}>
            <Table
              onRow={record => {
                return {
                  onClick: () => onRowClick(record), // click row
                };
              }}
              size="small"
              scroll={{ y: 'calc(100vh - 320px)', x: 700 }}
              columns={columns}
              dataSource={options}
              onRefresh={onRefresh}
            />
          </CardRoot>
        </Col>
      </Row>
      <Drawer
        title={current_customer.customer_id !== -1 ? 'Editar cliente' : 'Agregar nuevo cliente'}
        width={isTablet ? 350 : 420}
        onClose={() => onClose(true)}
        open={!!current_customer.customer_id}
        styles={{ body: { paddingBottom: 80 } }}
        destroyOnClose
      >
        <CustomerEditor onSuccess={onClose} />
      </Drawer>
    </div>
  );
};

export default Customers;
