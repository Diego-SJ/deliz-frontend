import Upload from '@/components/atoms/UploadFile';
import { APP_ROUTES } from '@/routes/routes';
import { useAppDispatch, useAppSelector } from '@/hooks/useStore';
import { productActions } from '@/redux/reducers/products';
import { Inventory, PriceList, Product } from '@/redux/reducers/products/types';
import {
  App,
  Breadcrumb,
  Button,
  Card,
  Col,
  Divider,
  Form,
  Input,
  Row,
  Select,
  Switch,
  Typography,
  UploadFile,
  message,
} from 'antd';
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeftOutlined } from '@ant-design/icons';
import CardRoot from '@/components/atoms/Card';
import ExistencesTable from './existences-table';
import PricesTable from './prices-table';
import { branchesActions } from '@/redux/reducers/branches';
import { QuickCategoryCreationForm } from '../categories/editor';
import { BUCKETS } from '@/constants/buckets';

type Params = {
  action: 'edit' | 'add';
  product_id?: string;
};

const UI_TEXTS = {
  breadcrumb: { edit: 'Editar producto', add: 'Agregar nuevo producto' },
  saveBtn: { edit: 'Guardar cambios', add: 'Guardar' },
};

const { TextArea } = Input;

const ProductEditor = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  let { action = 'add', product_id } = useParams<Params>();
  const [loading, setLoading] = useState(false);
  const { current_product, sizes, units, categories } = useAppSelector(({ products }) => products);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const firstRender = useRef<boolean>(false);
  const [inventory, setInventory] = useState<Inventory>({});
  const [priceList, setPriceList] = useState<PriceList>({});
  const { modal } = App.useApp();

  useEffect(() => {
    if (!firstRender.current) {
      firstRender.current = true;
      dispatch(productActions.fetchCategories({ refetch: true }));
      dispatch(productActions.sizes.get({ refetch: true }));
      dispatch(productActions.units.get({ refetch: true }));
      dispatch(branchesActions.getPrices());
      dispatch(branchesActions.getBranches());
    }
  }, [categories, sizes, dispatch]);

  useEffect(() => {
    if (!!current_product?.image_url) {
      setFileList([
        {
          uid: current_product.image_url.replace(BUCKETS.PRODUCTS.IMAGES_PATH, ''),
          name: current_product.image_url.replace(BUCKETS.PRODUCTS.IMAGES_PATH, ''),
          status: 'done',
          url: current_product.image_url,
        },
      ]);
    } else {
      setFileList([]);
    }
  }, [current_product]);

  useEffect(() => {
    setInventory(current_product?.inventory ?? {});
    setPriceList(current_product?.price_list ?? {});
  }, [current_product]);

  const clearFields = () => {
    form.resetFields();
    setFileList([]);
    setInventory({});
    setPriceList({});
  };

  const saveImage = async (): Promise<string | null> => {
    let fileObj = fileList[0]?.originFileObj;
    if (fileObj) {
      return await productActions.saveImage(fileObj);
    } else if (!!current_product?.image_url) {
      return current_product.image_url;
    }
    return null;
  };

  const saveNewProduct = async (values: Product) => {
    let image_url: string | null = await saveImage();

    await dispatch(productActions.saveProduct({ ...values, image_url }));
    clearFields();
  };

  const saveEditionProduct = async (values: Product) => {
    let image_url: string | null = await saveImage();

    await dispatch(productActions.updateProduct({ ...values, image_url }));
  };

  const onFinish = async () => {
    form
      .validateFields()
      .then(async values => {
        setLoading(true);
        let product = { ...values, inventory, price_list: priceList };

        if (action === 'add') await saveNewProduct(product);
        else if (action === 'edit') await saveEditionProduct(product);

        setLoading(false);
      })
      .catch(() => {
        message.error('Campos obligatorios sin completar.');
      });
  };

  const confirmDelete = async () => {
    setLoading(true);
    await dispatch(productActions.deleteProduct(current_product));
    setLoading(false);
  };

  return (
    <>
      <div className="flex flex-col pt-4 px-4 pb-10 w-full min-h-[calc(100vh-82px)] max-h-[calc(100vh-82px)] overflow-auto">
        <div className="w-full max-w-[900px] mx-auto mb-20">
          <Row justify="space-between" className="mb-3">
            <Col span={24}>
              <Breadcrumb
                items={[
                  {
                    title: <Link to={APP_ROUTES.PRIVATE.DASHBOARD.HOME.path}>{APP_ROUTES.PRIVATE.DASHBOARD.HOME.title}</Link>,
                    key: 'dashboard',
                  },
                  {
                    title: (
                      <Link to={APP_ROUTES.PRIVATE.DASHBOARD.PRODUCTS.path}>{APP_ROUTES.PRIVATE.DASHBOARD.PRODUCTS.title}</Link>
                    ),
                    key: 'products',
                  },
                  {
                    title: UI_TEXTS.breadcrumb[action],
                  },
                ]}
              />
            </Col>
          </Row>

          <div className="flex gap-4  w-full mb-4">
            <Button icon={<ArrowLeftOutlined />} shape="circle" onClick={() => navigate(-1)} />
            <Typography.Title level={4} className="m-0">
              {!!product_id && product_id !== 'new' ? 'Editar producto' : 'Agregar producto'}
            </Typography.Title>
          </div>

          <Form
            form={form}
            wrapperCol={{ span: 24 }}
            layout="vertical"
            onFinish={onFinish}
            initialValues={{ ...current_product, status: current_product?.status ?? 1 }}
            validateMessages={{
              required: '${label} es obligatorio.',
              types: {
                number: '${label} no es un número válido!',
              },
              number: {
                range: '${label} debe tener un valor minímo de ${min}',
              },
            }}
          >
            <Row gutter={[20, 20]} className="mb-5">
              <Col md={12} xs={24}>
                <CardRoot title="Información del producto">
                  <Form.Item name="product_id" hidden>
                    <Input />
                  </Form.Item>
                  <Form.Item name="name" label="Nombre" rules={[{ required: true }]}>
                    <Input placeholder="E.g: Helado de nuez" />
                  </Form.Item>

                  <Form.Item name="category_id" label="Categoría">
                    <Select
                      placeholder="Selecciona o crea una nueva categoría"
                      dropdownRender={menu => (
                        <>
                          <QuickCategoryCreationForm
                            onSuccess={category_id => {
                              form.setFieldsValue({ category_id });
                            }}
                          />
                          <Divider style={{ margin: '8px 0' }} />
                          {menu}
                        </>
                      )}
                      className="w-full"
                      showSearch
                      optionFilterProp="children"
                      virtual={false}
                      filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                      options={categories?.map(i => ({ value: i.category_id, label: i.name }))}
                    />
                  </Form.Item>
                  <div className="flex gap-4">
                    <Form.Item name="code" label="Código de barras" className="mb-0 w-full">
                      <Input placeholder="Opcional" />
                    </Form.Item>
                    <Form.Item name="sku" label="SKU" className="w-full">
                      <Input placeholder="Opcional" />
                    </Form.Item>
                  </div>

                  <Form.Item name="show_in_catalog" label="Mostrar en el catálogo en línea" className="mb-0 w-full">
                    <Switch />
                  </Form.Item>
                </CardRoot>
              </Col>
              <Col md={12} xs={24}>
                <CardRoot title="Imágen" className="h-full" styles={{ body: { height: '100%' } }}>
                  <div className="flex justify-center items-center">
                    <Form.Item name="image_url" className="mb-0">
                      <Upload setFileList={setFileList} fileList={fileList} />
                    </Form.Item>
                  </div>
                </CardRoot>
              </Col>
            </Row>
            <Row gutter={[20, 20]} className="mb-5">
              <Col span={24}>
                <CardRoot title="Detalles">
                  <div className="flex gap-4">
                    <Form.Item name="unit_id" label="Unidad" className="w-full">
                      <Select
                        placeholder="Unidad de venta"
                        virtual={false}
                        options={units?.data?.map(size => ({ value: size.unit_id, label: size?.name }))}
                      />
                    </Form.Item>
                    <Form.Item name="size_id" label="Tamaño" className="w-full">
                      <Select
                        placeholder="Grande"
                        virtual={false}
                        options={sizes?.data?.map(size => ({ value: size.size_id, label: size?.short_name }))}
                      />
                    </Form.Item>
                  </div>

                  <Form.Item name="description" label="Descripción" className="mb-0">
                    <TextArea rows={2} placeholder="E.g: Helado de nuez" />
                  </Form.Item>
                </CardRoot>
              </Col>
            </Row>

            <Row gutter={[20, 20]} className="mb-5">
              <Col span={24}>
                <ExistencesTable setInventory={setInventory} inventory={inventory} />
              </Col>
            </Row>

            <Row gutter={[20, 20]}>
              <Col span={24}>
                <PricesTable setPriceList={setPriceList} priceList={priceList} />
              </Col>
            </Row>
            {/* <Row gutter={[20, 5]}>
          <Col lg={{ span: 12 }} xs={{ span: 24 }}></Col>
          <Col lg={{ span: 12 }} xs={{ span: 24 }}>
            <Row gutter={[20, 5]}>
              <Col lg={{ span: 12 }} sm={{ span: 12 }} xs={{ span: 24 }}>
                <Form.Item name="retail_price" label="Precio menudeo" rules={[{ type: 'number', min: 0, required: true }]}>
                  <InputNumber prefix="$" style={{ width: '100%' }} placeholder="0.0" />
                </Form.Item>
                <Form.Item name="status" label="Status" rules={[{ required: true }]}>
                  <Select placeholder="Por default es Activo" virtual={false}>
                    {STATUS.map(item => (
                      <Select.Option key={item.id} value={item.id}>
                        {item.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item name="stock" label="Stock" rules={[{ type: 'number', min: 0, required: true }]}>
                  <InputNumber style={{ width: '100%' }} placeholder="0" />
                </Form.Item>
              </Col>
              <Col lg={{ span: 12 }} sm={{ span: 12 }} xs={{ span: 24 }}>
                <Form.Item name="wholesale_price" label="Precio mayoreo" rules={[{ type: 'number', min: 0, required: true }]}>
                  <InputNumber prefix="$" style={{ width: '100%' }} placeholder="0.0" />
                </Form.Item>
              </Col>
            </Row>
          </Col>
        </Row> */}
          </Form>

          <CardRoot title="Eliminar producto" className="my-5">
            <div className="flex flex-col md:flex-row gap-5 md:gap-8 justify-between items-center">
              <Typography.Text type="danger">
                Una vez eliminado el producto, no se podrá recuperar la información.
              </Typography.Text>
              <Button
                ghost
                danger
                className="w-full md:max-w-40"
                onClick={() => {
                  modal.confirm({
                    title: 'Eliminar producto',
                    type: 'error',
                    okText: 'Eliminar',
                    onOk: confirmDelete,
                    okType: 'danger',
                    cancelText: 'Cancelar',
                    content: '¿Confirma que deseas eliminar el producto?',
                    footer: (_, { OkBtn, CancelBtn }) => (
                      <>
                        <CancelBtn />
                        <OkBtn />
                      </>
                    ),
                  });
                }}
              >
                Eliminar
              </Button>
            </div>
          </CardRoot>
        </div>
      </div>
      <Card
        className="rounded-none box-border absolute bottom-0 left-0 w-full"
        classNames={{ body: 'w-full flex items-center' }}
        styles={{ body: { padding: '0px', height: '80px' } }}
      >
        <div className="flex justify-end gap-6 max-w-[700px] mx-auto w-full px-4 lg:px-0">
          <Button className="w-full md:w-40" onClick={() => navigate(-1)} loading={loading}>
            Cancelar
          </Button>
          <Button type="primary" className="w-full md:w-40" onClick={onFinish} loading={loading}>
            {UI_TEXTS.saveBtn[action]}
          </Button>
        </div>
      </Card>
    </>
  );
};

export default ProductEditor;
