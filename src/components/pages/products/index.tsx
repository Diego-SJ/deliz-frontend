import { APP_ROUTES } from '@/routes/routes';
import { useAppDispatch, useAppSelector } from '@/hooks/useStore';
import { productActions } from '@/redux/reducers/products';
import { Product } from '@/redux/reducers/products/types';
import functions from '@/utils/functions';
import { FileImageOutlined, PlusCircleOutlined, SearchOutlined } from '@ant-design/icons';
import { Avatar, Breadcrumb, Button, Col, Input, Row, Select, Tag } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Table from '@/components/molecules/Table';
import CardRoot from '@/components/atoms/Card';

type DataType = Product;

const columns: ColumnsType<DataType> = [
  {
    title: 'Nombre',
    dataIndex: 'name',
    width: 180,
    render: (text, record) => (
      <div className="flex items-center gap-4 pl-4">
        <Avatar
          {...(!!record?.image_url
            ? { src: record.image_url }
            : { icon: <FileImageOutlined className="text-slate-600 text-base" /> })}
          className={`bg-slate-600/10 p-1 w-10 min-w-10`}
          size="large"
        />
        <p>{text}</p>
      </div>
    ),
  },
  {
    title: 'Stock',
    dataIndex: 'stock',
    width: 50,
    align: 'center',
    render: (value: number, record) => {
      const stock = Object.values(record.inventory || {})?.reduce((acc, item) => acc + item.stock, 0);
      const hasStok = (stock || value) > 0;
      return <Tag color={hasStok ? '' : 'volcano'}>{stock || value || 'Sin stock'}</Tag>;
    },
  },

  {
    title: 'Precio',
    dataIndex: 'retail_price',
    render: (value: number, record) => {
      let price = Object.values(record.price_list || {})?.find(item => !!item?.is_default)?.unit_price || value;
      return <span>{functions.money(price)}</span>;
    },
    width: 70,
    align: 'center',
  },
  {
    title: 'Categoría',
    dataIndex: 'category_id',
    width: 70,
    align: 'center',
    render: (_, record: any) => (
      <Tag color={functions.getTagColor(record?.categories?.name || 'empty')}>{record?.categories?.name || 'Sin categoría'}</Tag>
    ),
  },
];

const Products = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { products, categories } = useAppSelector(({ products }) => products);
  const [options, setOptions] = useState<Product[]>([]);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      dispatch(productActions.fetchProducts({ refetch: true }));
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
    navigate(APP_ROUTES.PRIVATE.DASHBOARD.PRODUCT_EDITOR.hash`${'edit'}${record.product_id}`);
  };

  const getPanelValue = ({ searchText, categoryId }: { searchText?: string; categoryId?: number[] }) => {
    let _options = products?.filter(item => {
      return (
        (functions.includes(item?.name, searchText) || functions.includes(item?.description, searchText)) &&
        (!!categoryId?.length ? categoryId.includes(item.category_id) : true)
      );
    });
    setOptions(_options);
  };

  const onRefresh = () => {
    dispatch(productActions.fetchProducts({ refetch: true }));
  };

  return (
    <div className="max-w-[1200px] mx-auto">
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
      <Row>
        <Col span={24}>
          <Row gutter={[10, 10]} className="mt-3 mb-6">
            <Col lg={6} xs={24}>
              <Input
                placeholder="Buscar producto"
                style={{ width: '100%' }}
                allowClear
                prefix={<SearchOutlined />}
                onChange={({ target }) => getPanelValue({ searchText: target.value })}
              />
            </Col>
            <Col lg={6} xs={12}>
              <Select
                placeholder="Categorías"
                style={{ width: '100%' }}
                mode="multiple"
                allowClear
                options={categories?.map(item => ({ value: item.category_id, label: item.name }))}
                listHeight={1000}
                onChange={value => getPanelValue({ categoryId: value })}
              />
            </Col>
            <Col lg={{ span: 4, offset: 8 }} xs={{ offset: 0, span: 12 }}>
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
              scroll={{ y: 'calc(100vh - 300px)', x: 700 }}
              columns={columns}
              dataSource={options}
              onRefresh={onRefresh}
              totalItems={products?.length || 0}
            />
          </CardRoot>
        </Col>
      </Row>
    </div>
  );
};

export default Products;
