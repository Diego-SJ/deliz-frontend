import { APP_ROUTES } from '@/routes/routes';
import { useAppDispatch, useAppSelector } from '@/hooks/useStore';
import { productActions } from '@/redux/reducers/products';
import { Product } from '@/redux/reducers/products/types';
import functions from '@/utils/functions';
import {
  AppstoreOutlined,
  FileImageOutlined,
  FilterOutlined,
  PlusCircleOutlined,
  SearchOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import { Avatar, Breadcrumb, Button, Col, Dropdown, Input, Row, Tag, Typography, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CardRoot from '@/components/atoms/Card';
import useMediaQuery from '@/hooks/useMediaQueries';
import PaginatedList from '@/components/organisms/PaginatedList';
import { productHelpers } from '@/utils/products';
import BottomMenu from '@/components/organisms/bottom-menu';
import { Settings2 } from 'lucide-react';
import CreateProductsByCsv from './upload-csv';
import { useDebouncedCallback } from 'use-debounce';
import TableEmpty from '@/components/atoms/table-empty';

type DataType = Product;

const columns = (branch_id: string) =>
  [
    {
      title: 'Nombre',
      dataIndex: 'name',
      width: 180,
      render: (text, record) => (
        <div className="flex items-center gap-4 pl-4">
          <Avatar
            {...(!!record?.image_url
              ? { src: record.image_url }
              : {
                  icon: <FileImageOutlined className="text-slate-600 text-base" />,
                })}
            className={`bg-slate-600/10 p-1 w-8 min-w-8 h-8`}
            size="large"
          />
          <p className="m-0">{text}</p>
        </div>
      ),
    },
    {
      title: 'Stock',
      dataIndex: 'stock',
      width: 50,
      align: 'center',
      render: (_: number, record) => {
        const stock = productHelpers.getProductStock(record || null, branch_id);
        return <Tag color={stock >= 0 ? '' : 'volcano'}>{`${stock} unidades` || 'Sin stock'}</Tag>;
      },
    },

    {
      title: 'Precio',
      dataIndex: 'retail_price',
      render: (_: number, record) => {
        let price = productHelpers.getDefaultPrice(record.price_list || {}, record?.raw_price);
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
        <Tag color={functions.getTagColor(record?.categories?.name || 'empty')}>
          {record?.categories?.name || 'Sin categoría'}
        </Tag>
      ),
    },
  ] as ColumnsType<DataType>;

const categoriesSelected = (categories: number[]) => {
  return !!categories.length ? categories?.map((cat) => cat + '') : ['ALL'];
};

const Products = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { products, categories, filters, loading } = useAppSelector(({ products }) => products);
  const { currentBranch } = useAppSelector(({ branches }) => branches);
  const { permissions } = useAppSelector(({ users }) => users.user_auth.profile!);
  const [options, setOptions] = useState<Product[]>([]);
  const { isTablet } = useMediaQuery();
  const isFirstRender = useRef(true);
  const [openModal, setOpenModal] = useState(false);
  const [searchText, setSearchText] = useState('');

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

  useEffect(() => {
    if (!!filters?.products?.search) {
      setSearchText(filters?.products?.search);
    }
  }, [filters?.products?.search]);

  const onAddNew = () => {
    dispatch(productActions.setCurrentProduct({} as Product));
    navigate(APP_ROUTES.PRIVATE.PRODUCT_EDITOR.hash`${'add'}`);
  };

  const onRowClick = (record: DataType) => {
    dispatch(productActions.setCurrentProduct(record));
    navigate(APP_ROUTES.PRIVATE.PRODUCT_EDITOR.hash`${'edit'}${record.product_id}`);
  };

  const onRefresh = () => {
    dispatch(productActions.fetchProducts({ refetch: true }));
  };

  const resetPage = async () => {
    dispatch(productActions.setProductFilters({ page: 0 }));
    await functions.sleep(50);
  };

  const fetchProductsByTerm = useDebouncedCallback(() => {
    onRefresh();
  }, 650);

  const onCategoryChange = async (key: string) => {
    await resetPage();
    if (key === 'ALL') {
      await dispatch(productActions.setProductFilters({ categories: [] }));
    } else {
      let categories = [...(filters?.products?.categories || [])];
      if (categories?.includes(+key)) {
        categories = categories.filter((item) => item !== +key);
      } else {
        categories.push(+key);
      }
      await dispatch(productActions.setProductFilters({ categories }));
    }
    await onRefresh();
  };

  const onOrderChange = async (key: string) => {
    await resetPage();
    await dispatch(productActions.setProductFilters({ order_by: key }));
    await onRefresh();
  };

  const handleMoreOptions = async (key: string) => {
    if (key === 'upload_products') {
      setOpenModal(true);
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto">
      <Row justify="space-between" align="middle">
        <Col span={8} xs={24}>
          <Breadcrumb
            items={[
              {
                title: <Link to={APP_ROUTES.PRIVATE.HOME.path}>Dashboard</Link>,
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
            <Col lg={8} xs={24}>
              <Input
                placeholder="Buscar por nombre, código, SKU o descripción"
                style={{ width: '100%' }}
                allowClear
                size={isTablet ? 'large' : 'middle'}
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={({ target }) => {
                  setSearchText(target.value);
                  dispatch(
                    productActions.setProductFilters({
                      search: target.value,
                      page: 0,
                    }),
                  );
                  fetchProductsByTerm();
                }}
              />
            </Col>
            <Col lg={4} xs={12}>
              <Dropdown
                menu={{
                  selectedKeys: categoriesSelected(filters?.products?.categories || []),
                  items: [
                    { label: 'Todas las categorías', key: 'ALL' },
                    ...(categories?.map((cat) => ({
                      label: cat.name,
                      key: cat.category_id + '',
                    })) || []),
                  ],
                  multiple: true,
                  selectable: true,
                  onClick: async ({ key }) => onCategoryChange(key),
                }}
              >
                <Button
                  type={!filters?.products?.categories?.length ? 'default' : 'primary'}
                  block
                  className={`${!!filters?.products?.categories?.length ? '!bg-white' : ''}`}
                  ghost={!!filters?.products?.categories?.length}
                  size={isTablet ? 'large' : 'middle'}
                  icon={<AppstoreOutlined className="text-base" />}
                  onMouseEnter={() => {
                    if (!categories?.length) {
                      dispatch(productActions.fetchCategories({ refetch: true }));
                    }
                  }}
                >
                  Categorias
                </Button>
              </Dropdown>
            </Col>
            <Col lg={4} xs={12}>
              <Dropdown
                menu={{
                  selectedKeys: [filters?.products?.order_by || 'name,asc'],
                  items: [
                    { label: 'Nombre (A-Z)', key: 'name,asc' },
                    { label: 'Nombre (Z-A)', key: 'name,desc' },
                    {
                      label: 'Creado (recientes primero)',
                      key: 'created_at,desc',
                    },
                    {
                      label: 'Creado (antiguos primero)',
                      key: 'created_at,asc',
                    },
                  ],
                  selectable: true,
                  onClick: async ({ key }) => onOrderChange(key),
                }}
              >
                <Button
                  type={
                    !filters?.products?.order_by || filters?.products?.order_by === 'name,asc' ? 'default' : 'primary'
                  }
                  block
                  className={`${!!filters?.products?.order_by && filters?.products?.order_by !== 'name,asc' ? '!bg-white' : ''}`}
                  ghost={!!filters?.products?.order_by && filters?.products?.order_by !== 'name,asc'}
                  size={isTablet ? 'large' : 'middle'}
                  icon={<FilterOutlined className="text-base" />}
                >
                  Ordenar
                </Button>
              </Dropdown>
            </Col>
            <Col lg={4} xs={12}>
              <Dropdown
                menu={{
                  items: [
                    {
                      label: 'Creación masiva de productos',
                      key: 'upload_products',
                      icon: <UploadOutlined />,
                    },
                  ],
                  selectable: true,
                  onClick: async ({ key }) => handleMoreOptions(key),
                }}
              >
                <Button block size={isTablet ? 'large' : 'middle'} icon={<Settings2 className="text-base w-4" />}>
                  Más opciones
                </Button>
              </Dropdown>
            </Col>
            {permissions?.products?.add_product?.value && (
              <Col lg={4} xs={{ offset: 0, span: 12 }}>
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
                loading={loading}
                onRow={(record) => {
                  return {
                    onClick: () => onRowClick(record), // click row
                  };
                }}
                rowKey={(record) => record?.product_id?.toString()}
                size="small"
                scroll={{
                  y: 'calc(100vh - 280px)',
                  x: 700,
                  scrollToFirstRowOnChange: true,
                }}
                locale={{
                  emptyText: <TableEmpty title="No hay productos para mostrar" onAddNew={onAddNew} />,
                }}
                columns={columns(currentBranch?.branch_id || '')}
                dataSource={options}
                pagination={{
                  defaultCurrent: 0,
                  showTotal: (total, range) => `mostrando del ${range[0]} al ${range[1]} de ${total} elementos`,
                  showSizeChanger: true,
                  size: 'small',
                  onChange: (page, pageSize) => {
                    dispatch(
                      productActions.setProductFilters({
                        page: page - 1,
                        pageSize,
                      }),
                    );
                    dispatch(productActions.fetchProducts({ refetch: true }));
                  },
                  pageSize: filters?.products?.pageSize,
                  position: ['bottomRight'],
                  total: filters?.products?.totalRecords,
                  current: (filters?.products?.page || 0) + 1,
                  className: '!mt-0 border-t pt-2 !mb-2 text-gray-400 pr-4',
                  pageSizeOptions: ['20', '50', '100'],
                }}
              />
            </CardRoot>
          ) : (
            <PaginatedList
              loading={loading}
              className="mt-4 !max-h-[calc(100dvh-44px)]"
              $bodyHeight="calc(100dvh - 425px)"
              dataSource={options}
              locale={{
                emptyText: <TableEmpty title="No hay productos para mostrar" onAddNew={onAddNew} margin="small" />,
              }}
              pagination={{
                defaultCurrent: 1,
                showTotal: (total, range) => `${range[0]}-${range[1]} de ${total}`,
                showSizeChanger: true,
                size: 'small',
                onChange: (page, pageSize) => {
                  dispatch(
                    productActions.setProductFilters({
                      page: page - 1,
                      pageSize,
                    }),
                  );
                  dispatch(productActions.fetchProducts({ refetch: true }));
                },
                pageSize: filters?.products?.pageSize,
                position: 'bottom',
                align: 'center',
                total: filters?.products?.totalRecords,
                current: (filters?.products?.page || 0) + 1,
                className: '!mt-0  !mb-1 text-gray-400 pr-4',
                pageSizeOptions: ['20', '50', '100'],
              }}
              renderItem={(item) => {
                const { stock, hasStock } = productHelpers.calculateProductStock(item.inventory || {});
                let price = productHelpers.getDefaultPrice(item.price_list || {}, item?.raw_price);
                return (
                  <div
                    key={item.product_id}
                    onClick={() => onRowClick(item)}
                    className="flex py-2 pl-2 pr-4 border-b border-gray-200 cursor-pointer items-center"
                  >
                    <Avatar
                      src={item.image_url}
                      icon={<FileImageOutlined className="text-slate-400 text-xl" />}
                      className={`bg-slate-600/10 p-1 w-11 min-w-11 h-11 min-h-11`}
                      size="large"
                      shape="square"
                    />
                    <div className="flex items-start flex-col gap-1 pl-4">
                      <Typography.Paragraph className="!mb-0">{item.name}</Typography.Paragraph>
                      <Typography.Text type="secondary">{functions.money(price)}</Typography.Text>
                    </div>

                    <div className="flex flex-col text-end justify-center h-full items-end self-end ml-auto ">
                      <Typography.Text className="!mb-1" type="secondary">
                        {hasStock ? `${stock} existencias` : 'Sin stock'}
                      </Typography.Text>
                      <Tag
                        className="ml-auto w-fit mx-0"
                        color={functions.getTagColor(item?.categories?.name || 'empty')}
                      >
                        {item?.categories?.name || 'Sin categoría'}
                      </Tag>
                    </div>
                  </div>
                );
              }}
            />
          )}
        </Col>
      </Row>
      <CreateProductsByCsv visible={openModal} onClose={() => setOpenModal(false)} />
      {isTablet && <BottomMenu addBottomMargin />}
    </div>
  );
};

export default Products;
