import { APP_ROUTES } from '@/routes/routes';
import { useAppDispatch, useAppSelector } from '@/hooks/useStore';
import { productActions } from '@/redux/reducers/products';
import { Size } from '@/redux/reducers/products/types';
import functions from '@/utils/functions';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { Avatar, Breadcrumb, Button, Col, Drawer, Input, Row, Tag } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Table from '@/components/molecules/Table';
import DeleteButton from '@/components/molecules/Table/delete-btn';
import useMediaQuery from '@/hooks/useMediaQueries';
import SizeEditor from './editor';

type DataType = Size;

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
    title: 'Abreviación',
    dataIndex: 'short_name',
    render: text => <Tag color="blue">{text}</Tag>,
  },
  {
    title: 'Descripción',
    dataIndex: 'description',
    render: value => <span>{value || '- - -'}</span>,
  },
  {
    title: 'Fecha creación',
    dataIndex: 'created_at',
    render: created_at => {
      const date = functions.tableDate(created_at);
      return <span>{date}</span>;
    },
  },
  {
    title: 'Acciones',
    dataIndex: 'size_id',
    render: (id: number, record) => {
      return <DeleteButton deleteFunction={productActions.sizes.delete(id)} editFunction={productActions.sizes.edit(record)} />;
    },
  },
];

const ProductSizes = () => {
  const dispatch = useAppDispatch();
  const { isTablet } = useMediaQuery();
  const { sizes } = useAppSelector(({ products }) => products);
  const [options, setOptions] = useState<Size[]>([]);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      dispatch(productActions.sizes.get({ refetch: true }));
      return;
    }
  }, [dispatch]);

  useEffect(() => {
    setOptions(sizes?.data || []);
  }, [sizes?.data]);

  const onAddNew = () => {
    dispatch(productActions.setSize({ drawer: 'new' }));
  };

  const getPanelValue = useCallback(
    ({ searchText }: { searchText?: string }) => {
      let _options = sizes?.data?.filter(item => {
        return functions.includes(item.name, searchText) || functions.includes(item.description, searchText);
      });
      setOptions(_options || []);
    },
    [sizes?.data],
  );

  const onRefresh = () => {
    dispatch(productActions.sizes.get({ refetch: true }));
  };

  const onClose = () => {
    dispatch(productActions.setSize({ selected: {} as Size, drawer: null }));
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
              { title: 'Tamaños' },
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
                Nuevo
              </Button>
            </Col>
          </Row>
          <Table
            size="small"
            scroll={{ y: 'calc(100vh - 300px)', x: 700 }}
            columns={columns}
            onRefresh={onRefresh}
            totalItems={sizes?.data?.length}
            dataSource={options}
          />
          <Drawer
            title={sizes?.drawer === 'edit' ? 'Editar tamaño' : 'Agregar nuevo tamaño'}
            width={isTablet ? 350 : 420}
            onClose={onClose}
            open={!!sizes?.drawer}
            styles={{ body: { paddingBottom: 80 } }}
            destroyOnClose
          >
            <SizeEditor onSuccess={onClose} />
          </Drawer>
        </Col>
      </Row>
    </div>
  );
};

export default ProductSizes;
