import { APP_ROUTES } from '@/routes/routes';
import { useAppDispatch, useAppSelector } from '@/hooks/useStore';
import functions from '@/utils/functions';
import { PlusCircleOutlined } from '@ant-design/icons';
import {
  Avatar,
  Breadcrumb,
  Button,
  Col,
  Drawer,
  Input,
  Row,
  Typography,
} from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Customer } from '@/redux/reducers/customers/types';
import { customerActions } from '@/redux/reducers/customers';
import CustomerEditor from './editor';
import useMediaQuery from '@/hooks/useMediaQueries';
import Table from '@/components/molecules/Table';
import CardRoot from '@/components/atoms/Card';
import PaginatedList from '@/components/organisms/PaginatedList';
import DeleteCustomer from './delete-customer';
import BottomMenu from '@/components/organisms/bottom-menu';
import TableEmpty from '@/components/atoms/table-empty';

type DataType = Customer;

const columns: ColumnsType<DataType> = [
  {
    title: 'Nombre',
    dataIndex: 'name',
    width: 300,
    render: (text) => {
      return (
        <div className="flex items-center gap-4 pl-2">
          <Avatar className="bg-slate-600/10 text-slate-600 w-8 min-w-8 h-8">
            {text.charAt(0)}
          </Avatar>
          <p className="m-0 ">{text}</p>
        </div>
      );
    },
  },
  { title: 'Dirección', dataIndex: 'address', align: 'center' },
  {
    title: 'Teléfono',
    dataIndex: 'phone',
    align: 'center',
    render: (text) =>
      text ? (
        <Typography.Text type="secondary" copyable>
          {text}
        </Typography.Text>
      ) : null,
  },
  {
    title: 'Correo',
    dataIndex: 'email',
    align: 'center',
    render: (text) =>
      text ? (
        <Typography.Text copyable className="!text-primary">
          {text}
        </Typography.Text>
      ) : null,
  },
];

const Customers = () => {
  const dispatch = useAppDispatch();
  const [options, setOptions] = useState<Customer[]>([]);
  const { customers, current_customer } = useAppSelector(
    ({ customers }) => customers,
  );
  const { permissions } = useAppSelector(
    ({ users }) => users.user_auth.profile!,
  );
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
    dispatch(
      customerActions.setCurrentCustomer({ customer_id: -1 } as Customer),
    );
  };

  const onRowClick = (record: DataType) => {
    dispatch(customerActions.setCurrentCustomer(record));
  };

  const onClose = (success?: boolean) => {
    if (success) dispatch(customerActions.setCurrentCustomer({} as Customer));
  };

  const getPanelValue = useCallback(
    ({ searchText }: { searchText?: string }) => {
      let _options = customers?.filter((item) => {
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

  const deleteCompleted = () => {
    dispatch(customerActions.setCurrentCustomer({} as Customer));
    onRefresh();
  };

  return (
    <div className="max-w-[1200px] mx-auto ">
      <Row justify="space-between" align="middle">
        <Col span={24}>
          <Breadcrumb
            items={[
              {
                title: <Link to={APP_ROUTES.PRIVATE.HOME.path}>Dashboard</Link>,
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
            <Col lg={{ span: 10 }} sm={18} xs={24}>
              <Input
                size={isTablet ? 'large' : 'middle'}
                placeholder="Buscar por nombre, teléfono o dirección"
                style={{ width: '100%' }}
                allowClear
                onChange={({ target }) =>
                  getPanelValue({ searchText: target.value })
                }
              />
            </Col>
            {permissions?.customers?.add_customer?.value && (
              <Col
                lg={{ span: 4, offset: 10 }}
                sm={{ span: 6 }}
                xs={{ span: 24 }}
              >
                <Button
                  size={isTablet ? 'large' : 'middle'}
                  block
                  type="primary"
                  icon={<PlusCircleOutlined />}
                  onClick={onAddNew}
                >
                  Nuevo
                </Button>
              </Col>
            )}
          </Row>
          {!isTablet ? (
            <CardRoot styles={{ body: { padding: 0, overflow: 'hidden' } }}>
              <Table
                onRow={(record) => {
                  return {
                    onClick: () => onRowClick(record), // click row
                  };
                }}
                size="small"
                scroll={{ y: 'calc(100vh - 320px)', x: 700 }}
                columns={columns}
                dataSource={options}
                onRefresh={onRefresh}
                locale={{
                  emptyText: <TableEmpty onAddNew={onAddNew} />,
                }}
              />
            </CardRoot>
          ) : (
            <PaginatedList
              className="mt-3 !max-h-[calc(100dvh-64px)]"
              $bodyHeight="calc(100dvh - 380px)"
              pagination={{ position: 'bottom', align: 'center' }}
              dataSource={options}
              locale={{
                emptyText: <TableEmpty onAddNew={onAddNew} margin="small" />,
              }}
              renderItem={(item) => {
                return (
                  <div
                    key={item.customer_id}
                    onClick={() => onRowClick(item)}
                    className="flex py-3 pl-2 pr-4 border-b border-gray-200 cursor-pointer items-center"
                  >
                    <Avatar className="bg-slate-600/10 text-slate-600 w-10 min-w-10 h-10">
                      {item?.name?.charAt(0)}
                    </Avatar>
                    <div className="flex items-start flex-col pl-4">
                      <Typography.Paragraph className="!mb-0">
                        {item.name}
                      </Typography.Paragraph>
                      {/* <Typography.Text type="secondary">{item.address || 'Direcicón no registrada'}</Typography.Text> */}
                      <Typography.Text
                        className="!text-primary !m-0"
                        type="secondary"
                      >
                        {item.email || 'Sin correo'}
                      </Typography.Text>
                    </div>

                    <div className="flex flex-col text-end justify-center h-full items-end self-end ml-auto min-w-24">
                      <Typography.Text type="secondary">
                        {item.phone?.trim()?.replaceAll(' ', '')}
                      </Typography.Text>
                    </div>
                  </div>
                );
              }}
            />
          )}
        </Col>
      </Row>
      <Drawer
        title={
          current_customer.customer_id !== -1
            ? 'Editar cliente'
            : 'Agregar nuevo cliente'
        }
        width={isTablet ? '' : 420}
        height={isTablet ? '90dvh' : ''}
        placement={isTablet ? 'bottom' : 'right'}
        onClose={() => onClose(true)}
        open={!!current_customer.customer_id}
        styles={{ body: { paddingBottom: 80 } }}
        extra={
          current_customer.customer_id !== -1 &&
          current_customer.customer_id ? (
            <DeleteCustomer
              customer_id={current_customer.customer_id}
              onCompleted={deleteCompleted}
            />
          ) : null
        }
        destroyOnClose
      >
        <CustomerEditor onSuccess={(customer) => onClose(!!customer)} />
      </Drawer>

      {isTablet && <BottomMenu addBottomMargin />}
    </div>
  );
};

export default Customers;
