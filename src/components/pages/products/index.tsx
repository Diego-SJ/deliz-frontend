import { APP_ROUTES } from '@/constants/routes';
import { useAppDispatch, useAppSelector } from '@/hooks/useStore';
import { productActions } from '@/redux/reducers/products';
import { Product } from '@/redux/reducers/products/types';
import functions from '@/utils/functions';
import { PlusOutlined } from '@ant-design/icons';
import { Avatar, Breadcrumb, Button, Col, Row, Tag } from 'antd';
import Table, { ColumnsType } from 'antd/es/table';
import { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PopsicleImg from '@/assets/img/png/popsicle.png';
import { CATEGORIES } from '@/constants/categories';
import { STATUS } from '@/constants/status';

type DataType = Product;

const columns: ColumnsType<DataType> = [
  {
    title: 'Nombre',
    dataIndex: 'name',
    render: (text, record) => (
      <Row align="middle" gutter={10}>
        <Col>
          <Avatar src={record?.image_url ?? PopsicleImg} style={{ backgroundColor: '#eee' }} size="large" />
        </Col>
        <Col>
          <b>{text}</b>
          <br />
          <span>{CATEGORIES.find(item => item.id === record.category_id)?.name ?? '- - -'}</span>
        </Col>
      </Row>
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
    render: (value: Date | string) => functions.date1(value),
  },
  {
    title: 'Status',
    dataIndex: 'status',
    render: (statusId: number) => {
      const status = STATUS.find(item => item.id === statusId);
      return <Tag color={status?.color ?? 'orange'}>{status?.name ?? 'Desconocido'}</Tag>;
    },
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

const Products = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { products } = useAppSelector(({ products }) => products);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      dispatch(productActions.fetchProducts());
      return;
    }
  }, [dispatch]);

  const onAddNew = () => {
    dispatch(productActions.setCurrentProduct({} as Product));
    navigate(APP_ROUTES.PRIVATE.DASHBOARD.PRODUCT_EDITOR.hash`${'add'}`);
  };

  const onRowClick = (record: DataType) => {
    dispatch(productActions.setCurrentProduct(record));
    navigate(APP_ROUTES.PRIVATE.DASHBOARD.PRODUCT_EDITOR.hash`${'edit'}`);
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
              { title: 'Productos' },
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
            dataSource={products}
          />
        </Col>
      </Row>
    </div>
  );
};

export default Products;
