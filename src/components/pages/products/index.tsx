import { APP_ROUTES } from '@/routes/routes';
import { useAppDispatch, useAppSelector } from '@/hooks/useStore';
import { productActions } from '@/redux/reducers/products';
import { Product } from '@/redux/reducers/products/types';
import functions from '@/utils/functions';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { Avatar, Breadcrumb, Button, Col, Form, Input, Row, Select, Tag } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PopsicleImg from '@/assets/img/png/popsicle.webp';
import { CATEGORIES } from '@/constants/categories';
import { STATUS_OBJ } from '@/constants/status';
import Table from '@/components/molecules/Table';

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
    width: 180,
    render: text => (
      <div>
        <p style={{ fontWeight: 'bold' }}>{text}</p>
      </div>
    ),
  },
  {
    title: 'Categoría',
    dataIndex: 'category_id',
    width: 150,
    render: (_, record: any) => (
      <Tag color={functions.getTagColor(record?.categories?.name || 'empty')}>{record?.categories?.name || ''}</Tag>
    ),
  },

  {
    title: 'Stock',
    dataIndex: 'stock',
    width: 90,
    align: 'center',
  },
  {
    title: '$ Mayoreo',
    dataIndex: 'wholesale_price',
    render: (value: number) => functions.money(value),
    width: 100,
    align: 'center',
  },
  {
    title: '$ Menudeo',
    dataIndex: 'retail_price',
    render: (value: number) => functions.money(value),
    width: 100,
    align: 'center',
  },
  {
    title: 'Tamaño',
    dataIndex: 'sizes',
    render: (value: any) => <Tag>{value?.short_name || ''}</Tag>,
    width: 100,
    align: 'center',
  },
  {
    title: 'Unidad',
    dataIndex: 'units',
    render: (value: any) => <Tag>{value?.short_name || ''}</Tag>,
    width: 100,
    align: 'center',
  },
  {
    title: 'Fecha creación',
    dataIndex: 'created_at',
    width: 150,
    render: (value: Date | string) => functions.tableDate(value),
  },
  {
    title: 'Status',
    dataIndex: 'status',
    width: 95,
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
const categoriesOptions = CATEGORIES.map(item => ({ value: item.id, label: item.name }));

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
          <Row gutter={[10, 10]} style={{ marginBottom: 0 }}>
            <Col lg={6} xs={24}>
              <Input
                placeholder="Buscar producto"
                style={{ width: '100%' }}
                allowClear
                prefix={<SearchOutlined rev={{}} />}
                onChange={({ target }) => getPanelValue({ searchText: target.value })}
              />
            </Col>
            <Col lg={6} xs={12}>
              <Form.Item>
                <Select
                  placeholder="Categorías"
                  style={{ width: '100%' }}
                  mode="multiple"
                  allowClear
                  options={categoriesOptions}
                  listHeight={1000}
                  onChange={value => getPanelValue({ categoryId: value })}
                />
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 6 }} xs={{ offset: 0, span: 12 }}>
              <Button block type="primary" icon={<PlusOutlined rev={{}} />} onClick={onAddNew}>
                Nuevo
              </Button>
            </Col>
          </Row>
          <Table
            onRow={record => {
              return {
                onClick: () => onRowClick(record), // click row
              };
            }}
            size="small"
            scroll={{ y: 'calc(100vh - 300px)', x: 700 }}
            columns={columns}
            dataSource={options}
            onRefresh={onRefresh}
            totalItems={products?.length || 0}
          />
        </Col>
      </Row>
    </div>
  );
};

export default Products;
