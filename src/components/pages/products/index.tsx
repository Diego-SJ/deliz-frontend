import { APP_ROUTES } from '@/routes/routes';
import { useAppDispatch, useAppSelector } from '@/hooks/useStore';
import { productActions } from '@/redux/reducers/products';
import { Product } from '@/redux/reducers/products/types';
import functions from '@/utils/functions';
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { Avatar, Breadcrumb, Button, Card, Col, Input, Row, Select, Tag, Tooltip } from 'antd';
import Table, { ColumnsType } from 'antd/es/table';
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PopsicleImg from '@/assets/img/png/popsicle.png';
import { CATEGORIES } from '@/constants/categories';
import { STATUS, STATUS_OBJ } from '@/constants/status';

type DataType = Product;

const columns: ColumnsType<DataType> = [
  {
    title: '',
    dataIndex: 'name',
    width: 55,
    render: (_, record) => <Avatar src={record?.image_url ?? PopsicleImg} style={{ backgroundColor: '#eee' }} size="large" />,
  },
  {
    title: 'Nombre',
    dataIndex: 'name',
    render: (text, record) => (
      <div>
        <p style={{ fontWeight: 'bold' }}>{text}</p>
        <span>{CATEGORIES.find(item => item.id === record.category_id)?.name ?? '- - -'}</span>
      </div>
    ),
  },
  {
    title: 'Stock',
    dataIndex: 'stock',
  },
  {
    title: '$ Mayoreo',
    dataIndex: 'wholesale_price',
    render: (value: number) => functions.money(value),
  },
  {
    title: '$ Menudeo',
    dataIndex: 'retail_price',
    render: (value: number) => functions.money(value),
  },
  {
    title: 'Fecha creación',
    dataIndex: 'created_at',
    render: (value: Date | string) => functions.dateTime(value),
  },
  {
    title: 'Status',
    dataIndex: 'status',
    render: (statusId: number) => {
      const status = STATUS_OBJ[statusId];
      return <Tag color={status?.color ?? 'orange'}>{status?.name ?? 'Desconocido'}</Tag>;
    },
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

const Products = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { products } = useAppSelector(({ products }) => products);
  const [options, setOptions] = useState<Product[]>([]);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      dispatch(productActions.fetchProducts());
      return;
    }
  }, [dispatch]);

  useEffect(() => {
    setOptions(products);
  }, [products]);

  const onAddNew = () => {
    dispatch(productActions.setCurrentProduct({} as Product));
    navigate(APP_ROUTES.PRIVATE.DASHBOARD.PRODUCT_EDITOR.hash`${'add'}`);
  };

  const onRowClick = (record: DataType) => {
    dispatch(productActions.setCurrentProduct(record));
    navigate(APP_ROUTES.PRIVATE.DASHBOARD.PRODUCT_EDITOR.hash`${'edit'}`);
  };

  const getPanelValue = ({ searchText, categoryId }: { searchText?: string; categoryId?: number[] }) => {
    let _options = products?.filter(item => {
      return (
        (functions.includes(item.name, searchText) || functions.includes(item.description, searchText)) &&
        (!!categoryId?.length ? categoryId.includes(item.category_id) : true)
      );
    });
    setOptions(_options);
  };

  const onRefresh = () => {
    dispatch(productActions.fetchProducts({ refetch: true }));
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
              { title: 'Productos' },
            ]}
          />
        </Col>
      </Row>
      <Row style={{ marginTop: '10px' }}>
        <Col span={24}>
          <Card bodyStyle={{ padding: '10px' }} style={{ marginBottom: 10 }}>
            <Row gutter={[10, 10]}>
              <Col lg={6} xs={24}>
                <Input
                  size="large"
                  placeholder="Buscar producto"
                  style={{ width: '100%' }}
                  allowClear
                  onChange={({ target }) => getPanelValue({ searchText: target.value })}
                />
              </Col>
              <Col lg={6} xs={12}>
                <Select
                  size="large"
                  placeholder="Categorías"
                  style={{ width: '100%' }}
                  mode="multiple"
                  allowClear
                  onChange={value => getPanelValue({ categoryId: value })}
                >
                  {CATEGORIES.map((item, index) => (
                    <Select.Option key={index} value={item.id}>
                      {item.name}
                    </Select.Option>
                  ))}
                </Select>
              </Col>
              <Col lg={{ span: 6, offset: 6 }} xs={{ offset: 0, span: 12 }}>
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
            scroll={{ y: 'calc(100vh - 300px)', x: 700 }}
            columns={columns}
            pagination={false}
            dataSource={options}
            footer={() => (
              <Row>
                <Col>
                  <Tooltip title="Recargar">
                    <Button size="large" type="primary" icon={<ReloadOutlined rev={{}} />} onClick={onRefresh}>
                      Recargar
                    </Button>
                  </Tooltip>
                </Col>
              </Row>
            )}
          />
        </Col>
      </Row>
    </div>
  );
};

export default Products;
