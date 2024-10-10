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
} from '@ant-design/icons';
import {
  Avatar,
  Breadcrumb,
  Button,
  Col,
  Dropdown,
  Input,
  Row,
  Tag,
  Typography,
} from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Table from '@/components/molecules/Table';
import CardRoot from '@/components/atoms/Card';
import useMediaQuery from '@/hooks/useMediaQueries';
import PaginatedList from '@/components/organisms/PaginatedList';
import { productHelpers } from '@/utils/products';
import BottomMenu from '@/components/organisms/bottom-menu';

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
                  icon: (
                    <FileImageOutlined className="text-slate-600 text-base" />
                  ),
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
        return (
          <Tag color={stock >= 0 ? '' : 'volcano'}>
            {`${stock} unidades` || 'Sin stock'}
          </Tag>
        );
      },
    },

    {
      title: 'Precio',
      dataIndex: 'retail_price',
      render: (value: number, record) => {
        let price =
          Object.values(record.price_list || {})?.find(
            (item) => !!item?.is_default,
          )?.unit_price || value;
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
  const { products, categories, filters } = useAppSelector(
    ({ products }) => products,
  );
  const { currentBranch } = useAppSelector(({ branches }) => branches);
  const { permissions } = useAppSelector(
    ({ users }) => users.user_auth.profile!,
  );
  const [options, setOptions] = useState<Product[]>([]);
  const { isTablet } = useMediaQuery();
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
    navigate(APP_ROUTES.PRIVATE.PRODUCT_EDITOR.hash`${'add'}`);
  };

  const onRowClick = (record: DataType) => {
    dispatch(productActions.setCurrentProduct(record));
    navigate(
      APP_ROUTES.PRIVATE.PRODUCT_EDITOR.hash`${'edit'}${record.product_id}`,
    );
  };

  const getPanelValue = ({
    searchText,
  }: {
    searchText?: string;
    categoryId?: number[];
  }) => {
    let _options = products?.filter((item) => {
      return (
        functions.includes(item?.name, searchText) ||
        functions.includes(item?.description, searchText)
      );
    });
    setOptions(_options);
  };

  const onRefresh = () => {
    dispatch(productActions.fetchProducts({ refetch: true }));
  };

  const onCategoryChange = async (key: string) => {
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
    await dispatch(productActions.setProductFilters({ order_by: key }));
    await onRefresh();
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
            <Col lg={6} xs={24}>
              <Input
                placeholder="Buscar producto"
                style={{ width: '100%' }}
                allowClear
                size={isTablet ? 'large' : 'middle'}
                prefix={<SearchOutlined />}
                onChange={({ target }) =>
                  getPanelValue({ searchText: target.value })
                }
              />
            </Col>
            <Col lg={4} xs={12}>
              <Dropdown
                menu={{
                  selectedKeys: categoriesSelected(
                    filters?.products?.categories || [],
                  ),
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
                  type={
                    !filters?.products?.categories?.length
                      ? 'default'
                      : 'primary'
                  }
                  block
                  className={`${!!filters?.products?.categories?.length ? '!bg-white' : ''}`}
                  ghost={!!filters?.products?.categories?.length}
                  size={isTablet ? 'large' : 'middle'}
                  icon={<AppstoreOutlined className="text-base" />}
                  onMouseEnter={() => {
                    if (!categories?.length) {
                      dispatch(
                        productActions.fetchCategories({ refetch: true }),
                      );
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
                    !filters?.products?.order_by ||
                    filters?.products?.order_by === 'name,asc'
                      ? 'default'
                      : 'primary'
                  }
                  block
                  className={`${!!filters?.products?.order_by && filters?.products?.order_by !== 'name,asc' ? '!bg-white' : ''}`}
                  ghost={
                    !!filters?.products?.order_by &&
                    filters?.products?.order_by !== 'name,asc'
                  }
                  size={isTablet ? 'large' : 'middle'}
                  icon={<FilterOutlined className="text-base" />}
                >
                  Ordenar
                </Button>
              </Dropdown>
            </Col>
            {permissions?.products?.add_product?.value && (
              <Col lg={{ span: 4, offset: 6 }} xs={{ offset: 0, span: 12 }}>
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
                rowKey={(record) => record?.product_id?.toString()}
                size="small"
                scroll={{
                  y: 'calc(100vh - 280px)',
                  x: 700,
                  scrollToFirstRowOnChange: true,
                }}
                columns={columns(currentBranch?.branch_id || '')}
                dataSource={options}
                onRefresh={onRefresh}
                hideTotalCount
                pagination={{
                  showTotal: (total, range) =>
                    `mostrando del ${range[0]} al ${range[1]} de ${total} elementos`,
                  showSizeChanger: true,
                  size: 'small',
                  pageSize: 20,
                  position: ['bottomRight'],
                  total: products?.length,
                  className: '!mt-0 border-t pt-2 !mb-2 text-gray-400 pr-4',
                  pageSizeOptions: ['20', '50', '100'],
                }}
              />
            </CardRoot>
          ) : (
            <PaginatedList
              className="mt-4 !max-h-[calc(100dvh-44px)]"
              $bodyHeight="calc(100dvh - 425px)"
              dataSource={options}
              pagination={{
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} de ${total}`,
                showSizeChanger: true,
                size: 'small',
                pageSize: 20,
                position: 'bottom',
                align: 'center',
                total: products?.length,
                className: '!mt-0 !mb-1 text-gray-400 pr-4',
                pageSizeOptions: ['20', '50', '100'],
              }}
              renderItem={(item) => {
                const { stock, hasStock } =
                  productHelpers.calculateProductStock(item.inventory || {});
                return (
                  <div
                    key={item.product_id}
                    onClick={() => onRowClick(item)}
                    className="flex py-2 pl-2 pr-4 border-b border-gray-200 cursor-pointer items-center"
                  >
                    <Avatar
                      src={item.image_url}
                      icon={
                        <FileImageOutlined className="text-slate-400 text-xl" />
                      }
                      className={`bg-slate-600/10 p-1 w-11 min-w-11 h-11 min-h-11`}
                      size="large"
                      shape="square"
                    />
                    <div className="flex items-start flex-col gap-1 pl-4">
                      <Typography.Paragraph className="!mb-0">
                        {item.name}
                      </Typography.Paragraph>
                      <Typography.Text type="secondary">
                        {functions.money(item.raw_price)}
                      </Typography.Text>
                    </div>

                    <div className="flex flex-col text-end justify-center h-full items-end self-end ml-auto ">
                      <Typography.Text className="!mb-1" type="secondary">
                        {hasStock ? `${stock} existencias` : 'Sin stock'}
                      </Typography.Text>
                      <Tag
                        className="ml-auto w-fit mx-0"
                        color={functions.getTagColor(
                          item?.categories?.name || 'empty',
                        )}
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

      {isTablet && <BottomMenu addBottomMargin />}
    </div>
  );
};

export default Products;
