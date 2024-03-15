import { APP_ROUTES } from '@/routes/routes';
import { useAppDispatch, useAppSelector } from '@/hooks/useStore';
import { productActions } from '@/redux/reducers/products';
import { Category } from '@/redux/reducers/products/types';
import functions from '@/utils/functions';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { Avatar, Breadcrumb, Button, Col, Drawer, Input, Row, Tag } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { STATUS_OBJ } from '@/constants/status';
import Table from '@/components/molecules/Table';
import DeleteButton from '@/components/molecules/Table/delete-btn';
import useMediaQuery from '@/hooks/useMediaQueries';
import CategoryEditor from './editor';

type DataType = Category;

const columns: ColumnsType<DataType> = [
  {
    title: '',
    dataIndex: 'name',
    width: 55,
    render: value => <Avatar size="large">{value.substring(0, 2)}</Avatar>,
  },
  {
    title: 'Nombre',
    dataIndex: 'name',
    render: text => <p style={{ fontWeight: 'bold' }}>{text}</p>,
  },
  {
    title: 'Descripción',
    dataIndex: 'description',
    render: value => <span>{value || '- - -'}</span>,
  },
  {
    title: 'Status',
    dataIndex: 'status',
    render: (statusId: number) => {
      const status = STATUS_OBJ[statusId];
      return <Tag color={status?.color ?? 'orange'}>{status?.name ?? 'Desconocido'}</Tag>;
    },
  },
  {
    title: 'Acciones',
    dataIndex: 'category_id',
    render: (category_id: number, record) => {
      return (
        <DeleteButton
          deleteFunction={productActions.categories.delete(category_id)}
          editFunction={productActions.setCurrentCategory(record)}
        />
      );
    },
  },
];

const Products = () => {
  const dispatch = useAppDispatch();
  const { isTablet } = useMediaQuery();
  const { categories, current_category } = useAppSelector(({ products }) => products);
  const [options, setOptions] = useState<Category[]>([]);
  const [drawerStatus, setDrawerStatus] = useState<'new' | 'edit' | null>(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      dispatch(productActions.fetchCategories({ refetch: true }));
      return;
    }
  }, [dispatch]);

  useEffect(() => {
    setOptions(categories);
  }, [categories]);

  const onAddNew = () => {
    setDrawerStatus('new');
  };

  const onRowClick = (record: DataType) => {
    dispatch(productActions.setCurrentCategory(record));
    setDrawerStatus('edit');
  };

  const getPanelValue = useCallback(
    ({ searchText }: { searchText?: string }) => {
      let _options = categories?.filter(item => {
        return functions.includes(item.name, searchText) || functions.includes(item.description, searchText);
      });
      setOptions(_options);
    },
    [categories],
  );

  const onRefresh = () => {
    dispatch(productActions.fetchCategories({ refetch: true }));
  };

  const onClose = () => {
    setDrawerStatus(null);
    dispatch(productActions.setCurrentCategory({}));
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
                title: <Link to={APP_ROUTES.PRIVATE.DASHBOARD.PRODUCTS.path}>Productos</Link>,
                key: 'products',
              },
              { title: 'Categorias' },
            ]}
          />
        </Col>
      </Row>
      <Row style={{ marginTop: '10px' }}>
        <Col span={24}>
          <Row gutter={[10, 10]} style={{ marginBottom: 20 }}>
            <Col lg={6} xs={24}>
              <Input
                placeholder="Buscar producto"
                style={{ width: '100%' }}
                allowClear
                onChange={({ target }) => getPanelValue({ searchText: target.value })}
                prefix={<SearchOutlined rev={{}} />}
              />
            </Col>
            <Col lg={{ span: 6, offset: 12 }} xs={{ offset: 0, span: 24 }}>
              <Button block type="primary" icon={<PlusOutlined rev={{}} />} onClick={onAddNew}>
                Nuevo
              </Button>
            </Col>
          </Row>
          <Table
            size="small"
            scroll={{ y: 'calc(100vh - 300px)', x: 700 }}
            columns={columns}
            onRefresh={onRefresh}
            totalItems={categories?.length}
            dataSource={options}
          />
          <Drawer
            title={!!current_category?.category_id ? 'Editar categoría' : 'Agregar nueva categoría'}
            width={isTablet ? 350 : 420}
            onClose={onClose}
            open={!!drawerStatus || !!current_category?.category_id}
            styles={{ body: { paddingBottom: 80 } }}
            destroyOnClose
          >
            <CategoryEditor onSuccess={onClose} />
          </Drawer>
        </Col>
      </Row>
    </div>
  );
};

export default Products;
