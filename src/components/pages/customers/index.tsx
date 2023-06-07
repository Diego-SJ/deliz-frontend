import { APP_ROUTES } from '@/constants/routes';
import { useAppDispatch, useAppSelector } from '@/hooks/useStore';
import functions from '@/utils/functions';
import { PlusOutlined } from '@ant-design/icons';
import { Avatar, Breadcrumb, Button, Col, Drawer, Row } from 'antd';
import Table, { ColumnsType } from 'antd/es/table';
import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import PopsicleImg from '@/assets/img/png/popsicle.png';
import { Customer } from '@/redux/reducers/customers/types';
import { customerActions } from '@/redux/reducers/customers';
import CustomerEditor from './editor';

type DataType = Customer;

const columns: ColumnsType<DataType> = [
  {
    title: 'Nombre',
    dataIndex: 'name',
    render: text => (
      <Row align="middle" gutter={10}>
        <Col>
          <Avatar src={PopsicleImg} style={{ backgroundColor: '#eee', padding: '5px' }} size="large" />
        </Col>
        <Col>
          <b>{text}</b>
        </Col>
      </Row>
    ),
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

const rowSelection = {
  onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
  },
  getCheckboxProps: (record: DataType) => ({
    disabled: record.name === 'Disabled User', // Column configuration not to be checked
    name: record.name,
  }),
};

const Customers = () => {
  const dispatch = useAppDispatch();
  const { customers, current_customer } = useAppSelector(({ customers }) => customers);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      dispatch(customerActions.fetchCustomers());
      return;
    }
  }, [dispatch]);

  const onAddNew = () => {
    dispatch(customerActions.setCurrentCustomer({ customer_id: -1 } as Customer));
  };

  const onRowClick = (record: DataType) => {
    dispatch(customerActions.setCurrentCustomer(record));
  };

  const onClose = (success?: boolean) => {
    if (success) dispatch(customerActions.setCurrentCustomer({} as Customer));
  };

  return (
    <div>
      <Row justify="space-between" align="middle">
        <Col span={8}>
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
        <Col span={4}>
          <Button block type="primary" size="large" icon={<PlusOutlined rev={{}} />} onClick={onAddNew}>
            Nuevo
          </Button>
        </Col>
      </Row>
      <Row style={{ marginTop: '20px' }}>
        <Col span={24}>
          <Table
            rowSelection={{
              type: 'checkbox',
              ...rowSelection,
            }}
            onRow={record => {
              return {
                onClick: () => onRowClick(record), // click row
              };
            }}
            columns={columns}
            dataSource={customers}
          />
        </Col>
      </Row>
      <Drawer
        title={current_customer.customer_id !== -1 ? 'Editar cliente' : 'Agregar nuevo cliente'}
        width={420}
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
