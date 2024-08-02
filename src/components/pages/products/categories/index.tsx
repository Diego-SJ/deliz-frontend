import { useAppDispatch, useAppSelector } from '@/hooks/useStore';
import { productActions } from '@/redux/reducers/products';
import { Category } from '@/redux/reducers/products/types';
import functions from '@/utils/functions';
import { PlusCircleOutlined, SearchOutlined } from '@ant-design/icons';
import { Avatar, Button, Card, Col, Drawer, Input, List, Row, Tag, Typography } from 'antd';
import Table, { ColumnsType } from 'antd/es/table';
import { useCallback, useEffect, useRef, useState } from 'react';
import { STATUS_OBJ } from '@/constants/status';
import useMediaQuery from '@/hooks/useMediaQueries';
import CategoryEditor from './editor';
import BreadcrumbSettings from '../../settings/menu/breadcrumb';
import ActionTableButtons from '@/components/molecules/Table/action-table-btns';
import CardRoot from '@/components/atoms/Card';

type DataType = Category;

const columns: ColumnsType<DataType> = [
  {
    title: 'Categoría',
    align: 'center',
    dataIndex: 'name',
    width: 'auto',
    render: text => {
      return (
        <div className="flex gap-4 pl-2 items-center">
          <Avatar size="large" shape="circle" className="bg-gray-100/10 border border-secondary/40 text-secondary">
            {text.substring(0, 2)}
          </Avatar>
          <p className="">{text}</p>
        </div>
      );
    },
  },
  {
    title: 'Status',
    dataIndex: 'status',
    align: 'center',
    width: 200,
    render: (statusId: number) => {
      const status = STATUS_OBJ[statusId];
      return <Tag color={status?.color ?? 'orange'}>{status?.name ?? 'Desconocido'}</Tag>;
    },
  },
  {
    title: 'Acciones',
    dataIndex: 'category_id',
    align: 'center',
    width: 200,
    render: (category_id: number, record) => {
      return (
        <ActionTableButtons
          deleteFunction={productActions.categories.delete(category_id)}
          editFunction={productActions.setCurrentCategory(record)}
        />
      );
    },
  },
];

const CategoriesPage = () => {
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

  const getPanelValue = useCallback(
    ({ searchText }: { searchText?: string }) => {
      let _options = categories?.filter(item => {
        return functions.includes(item.name, searchText) || functions.includes(item.description, searchText);
      });
      setOptions(_options);
    },
    [categories],
  );

  const onClose = () => {
    setDrawerStatus(null);
    dispatch(productActions.setCurrentCategory({}));
  };

  return (
    <div className="p-4 max-w-[730px] w-full mx-auto">
      <BreadcrumbSettings items={[{ label: 'Categorías' }]} />

      <div className="flex flex-col mb-0 w-full">
        <Typography.Title level={4}>Categorías de productos</Typography.Title>

        <div className="flex justify-between md:items-center mb-6 flex-col md:flex-row gap-3">
          <Typography.Text type="secondary">Administra las categorías de productos que deseas ofrecer</Typography.Text>

          <Button icon={<PlusCircleOutlined />} onClick={onAddNew}>
            Agregar nueva
          </Button>
        </div>
      </div>

      <Row>
        <Col span={24}>
          <Row gutter={[10, 10]} style={{ marginBottom: 20 }}>
            <Col lg={12} xs={24}>
              <Input
                placeholder="Buscar categoría"
                style={{ width: '100%' }}
                allowClear
                onChange={({ target }) => getPanelValue({ searchText: target.value })}
                prefix={<SearchOutlined />}
              />
            </Col>
          </Row>
          <CardRoot style={{ width: '100%' }} styles={{ body: { padding: 0 } }} title="Categorías">
            <List
              itemLayout="horizontal"
              footer={
                <div className="px-2">
                  <Button type="text" icon={<PlusCircleOutlined />} className="text-primary" onClick={onAddNew}>
                    Agregar nueva
                  </Button>
                </div>
              }
              className="px-0"
              dataSource={options}
              renderItem={item => (
                <List.Item
                  styles={{ actions: { paddingRight: 15, margin: 0 } }}
                  classNames={{ actions: 'flex' }}
                  className="flex"
                  actions={[
                    <ActionTableButtons
                      deleteFunction={productActions.categories.delete(item.category_id as number)}
                      editFunction={productActions.setCurrentCategory(item)}
                    />,
                  ]}
                >
                  <div className="pl-4 md:pl-6 flex gap-4">
                    <Typography.Text>{item.name}</Typography.Text>
                  </div>
                </List.Item>
              )}
            />
          </CardRoot>
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

export default CategoriesPage;
