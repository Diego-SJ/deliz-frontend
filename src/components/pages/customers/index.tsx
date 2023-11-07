import { APP_ROUTES } from '@/routes/routes';
import { useAppDispatch, useAppSelector } from '@/hooks/useStore';
import functions from '@/utils/functions';
import { PlusOutlined } from '@ant-design/icons';
import { Avatar, Breadcrumb, Button, Card, Col, Drawer, Input, Row } from 'antd';
import Table, { ColumnsType } from 'antd/es/table';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import PopsicleImg from '@/assets/img/png/popsicle.png';
import { Customer } from '@/redux/reducers/customers/types';
import { customerActions } from '@/redux/reducers/customers';
import CustomerEditor from './editor';
import useMediaQuery from '@/hooks/useMediaQueries';

type DataType = Customer;

const columns: ColumnsType<DataType> = [
  {
    title: '',
    dataIndex: 'name',
    width: 55,
    render: () => <Avatar src={PopsicleImg} style={{ backgroundColor: '#eee', padding: '8px' }} size="large" />,
  },
  {
    title: 'Nombre',
    dataIndex: 'name',
    render: text => <b>{text}</b>,
  },
  { title: 'Dirección', dataIndex: 'address' },
  { title: 'Teléfono', dataIndex: 'phone' },
  { title: 'Correo', dataIndex: 'email' },
  {
    title: 'Fecha creación',
    dataIndex: 'created_at',
    render: (value: Date | string) => functions.date1(value),
  },
];

// const rowSelection = {
//   onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
//     console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
//   },
//   getCheckboxProps: (record: DataType) => ({
//     disabled: record.name === 'Disabled User', // Column configuration not to be checked
//     name: record.name,
//   }),
// };

const Customers = () => {
  const dispatch = useAppDispatch();
  const [options, setOptions] = useState<Customer[]>([]);
  const { customers, current_customer } = useAppSelector(({ customers }) => customers);
  const { isTablet } = useMediaQuery();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      dispatch(customerActions.fetchCustomers());
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

  const getPanelValue = ({ searchText }: { searchText?: string }) => {
    let _options = customers?.filter(item => {
      return (
        functions.includes(item.name, searchText) ||
        functions.includes(item.phone, searchText) ||
        functions.includes(item.email, searchText)
      );
    });
    setOptions(_options);
  };

  return (
    <div>
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
      <Row style={{ marginTop: '10px' }}>
        <Col span={24}>
          <Card bodyStyle={{ padding: '10px' }} style={{ marginBottom: 10 }}>
            <Row gutter={[10, 10]}>
              <Col lg={{ span: 6 }} sm={18} xs={24}>
                <Input
                  size="large"
                  placeholder="Buscar cliente"
                  style={{ width: '100%' }}
                  allowClear
                  onChange={({ target }) => getPanelValue({ searchText: target.value })}
                />
              </Col>
              <Col lg={{ span: 6, offset: 12 }} sm={{ span: 6 }} xs={{ span: 24 }}>
                <Button size="large" block type="primary" icon={<PlusOutlined rev={{}} />} onClick={onAddNew}>
                  Nuevo
                </Button>
              </Col>
            </Row>
          </Card>
          <Table
            // rowSelection={{
            //   type: 'checkbox',
            //   ...rowSelection,
            // }}
            onRow={record => {
              return {
                onClick: () => onRowClick(record), // click row
              };
            }}
            size="small"
            scroll={{ y: 'calc(100vh - 320px)', x: 700 }}
            columns={columns}
            dataSource={options}
          />
        </Col>
      </Row>
      <Drawer
        title={current_customer.customer_id !== -1 ? 'Editar cliente' : 'Agregar nuevo cliente'}
        width={isTablet ? 350 : 420}
        onClose={() => onClose(true)}
        open={!!current_customer.customer_id}
        bodyStyle={{ paddingBottom: 80 }}
        destroyOnClose
      >
        <CustomerEditor onSuccess={onClose} />
      </Drawer>
    </div>
  );
};

export default Customers;
