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
  Space,
  Switch,
  Typography,
  UploadFile,
  message,
} from 'antd';
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeftOutlined, BarcodeOutlined } from '@ant-design/icons';
import CardRoot from '@/components/atoms/Card';
import ExistencesTable from './existences-table';
import PricesTable from './prices-table';

import { BUCKETS } from '@/constants/buckets';
import { QuickCategoryCreationForm } from '../../settings/categories/editor';
import BarcodeScanner from '@/components/organisms/bar-code-reader';
import { branchesActions } from '@/redux/reducers/branches';
import { ModuleAccess, useMembershipAccess } from '@/routes/module-access';
import SelectOrCreate from '@/components/atoms/select-or-create';

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
  const { hasAccess } = useMembershipAccess();
  const { current_product, sizes, units, categories } = useAppSelector(({ products }) => products);
  const { permissions } = useAppSelector(({ users }) => users.user_auth.profile!);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const firstRender = useRef<boolean>(false);
  const [inventory, setInventory] = useState<Inventory>({});
  const [priceList, setPriceList] = useState<PriceList>({});
  const [openBarCode, setOpenBarCode] = useState(false);
  const [barCode, setBarCode] = useState<string | undefined>(undefined);
  const { modal } = App.useApp();
  const mounted = useRef<boolean>(false);

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;

      if (!categories?.length) dispatch(productActions.fetchCategories({ refetch: true }));
      if (!units?.data?.length) dispatch(productActions.units.get({ refetch: true }));
      if (!sizes?.data?.length) dispatch(productActions.sizes.get({ refetch: true }));
    }
  }, [dispatch, categories, units?.data, sizes?.data, mounted]);

  useEffect(() => {
    if (!firstRender.current) {
      firstRender.current = true;

      dispatch(branchesActions.getPrices());

      if (!!product_id && product_id !== 'new') {
        dispatch(productActions.getProductById(Number(product_id)));
      }
    }
  }, [product_id, dispatch]);

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
    if (!!current_product?.product_id) {
      setInventory(current_product?.inventory ?? {});
      setPriceList(current_product?.price_list ?? {});
      setBarCode(current_product?.code);
      form.setFieldsValue({
        ...current_product,
        status: current_product?.status ?? 1,
      });
    }
  }, [current_product]);

  const clearFields = () => {
    form.resetFields();
    setFileList([]);
    setInventory({});
    setPriceList({});
    setBarCode(undefined);
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

    const success = await dispatch(productActions.saveProduct({ ...values, image_url }));
    if (success) clearFields();
  };

  const saveEditionProduct = async (values: Product) => {
    let image_url: string | null = await saveImage();

    await dispatch(productActions.updateProduct({ ...values, image_url }));
  };

  const onFinish = async () => {
    form
      .validateFields()
      .then(async (values) => {
        setLoading(true);
        let product = {
          ...values,
          inventory,
          price_list: priceList,
          code: barCode,
        };

        if (action === 'add' && !!permissions?.products?.add_product?.value) await saveNewProduct(product);
        else if (action === 'edit' && !!permissions?.products?.edit_product?.value) await saveEditionProduct(product);

        setLoading(false);
      })
      .catch(() => {
        message.error('Campos obligatorios sin completar.');
      });
  };

  const confirmDelete = async () => {
    setLoading(true);
    const success = await dispatch(productActions.deleteProduct(current_product));
    if (success) {
      clearFields();
      navigate(-1);
    }
    setLoading(false);
  };

  return (
    <>
      <div className="flex flex-col pt-4 px-4 pb-10 w-full min-h-[calc(100dvh-64px)] max-h-[calc(100dvh-64px)] overflow-auto">
        <div className="w-full max-w-[900px] mx-auto mb-20">
          <Row justify="space-between" className="mb-3">
            <Col span={24}>
              <Breadcrumb
                items={[
                  {
                    title: <Link to={APP_ROUTES.PRIVATE.HOME.path}>{APP_ROUTES.PRIVATE.HOME.title}</Link>,
                    key: 'dashboard',
                  },
                  {
                    title: <Link to={APP_ROUTES.PRIVATE.PRODUCTS.path}>{APP_ROUTES.PRIVATE.PRODUCTS.title}</Link>,
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
            requiredMark={false}
            onFinish={onFinish}
            initialValues={{
              ...current_product,
              status: current_product?.status ?? 1,
              show_in_catalog: current_product?.show_in_catalog ?? true,
            }}
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
              <Col md={hasAccess('update_image') ? 12 : 24} xs={24}>
                <CardRoot title="Información del producto">
                  <Form.Item name="product_id" hidden>
                    <Input size="large" />
                  </Form.Item>
                  <Form.Item name="name" label="Nombre" rules={[{ required: true }]}>
                    <Input size="large" placeholder="E.g: Helado de nuez" />
                  </Form.Item>

                  <Form.Item name="category_id" label="Categoría">
                    <SelectOrCreate
                      size="large"
                      placeholder="Selecciona o crea una nueva categoría"
                      onCreate={async (name) => {
                        const category_id = await dispatch(productActions.categories.add({ name, description: name }));
                        form.setFieldsValue({ category_id });
                      }}
                      className="w-full"
                      options={categories?.map((i) => ({
                        value: i.category_id,
                        label: i.name,
                      }))}
                    />
                  </Form.Item>
                  <div className="flex gap-4">
                    {openBarCode && (
                      <BarcodeScanner
                        paused={!openBarCode}
                        onCancel={() => setOpenBarCode(false)}
                        onScan={(value) => {
                          form.setFieldsValue({ code: value[0].rawValue });
                          setBarCode(value[0].rawValue);
                          setOpenBarCode(false);
                        }}
                      />
                    )}
                    <ModuleAccess moduleName="use_barcode_scanner">
                      <Form.Item
                        name="code"
                        label="Código de barras"
                        className="mb-0 w-full"
                        tooltip="Escanea el código de barras del producto"
                      >
                        <Space.Compact style={{ width: '100%' }}>
                          <Input size="large" placeholder="Opcional" value={barCode as string} />
                          <Button size="large" icon={<BarcodeOutlined />} onClick={() => setOpenBarCode(true)} />
                        </Space.Compact>
                      </Form.Item>
                    </ModuleAccess>
                    <Form.Item name="sku" label="SKU" className="w-full">
                      <Input size="large" placeholder="Opcional" />
                    </Form.Item>
                  </div>
                  <ModuleAccess moduleName="show_in_catalog">
                    {permissions?.products?.show_in_catalog?.value && (
                      <Form.Item name="show_in_catalog" label="Mostrar en el catálogo en línea" className="mb-0 w-full">
                        <Switch />
                      </Form.Item>
                    )}
                  </ModuleAccess>
                </CardRoot>
              </Col>
              <ModuleAccess moduleName="update_image">
                <Col md={12} xs={24}>
                  <CardRoot title="Imágen" className="h-full" styles={{ body: { height: '100%' } }}>
                    <div className="flex justify-center items-center">
                      <Form.Item name="image_url" className="mb-0">
                        <Upload setFileList={setFileList} fileList={fileList} />
                      </Form.Item>
                    </div>
                  </CardRoot>
                </Col>
              </ModuleAccess>
            </Row>
            <Row gutter={[20, 20]} className="mb-5">
              <Col span={24}>
                <CardRoot title="Detalles">
                  <div className="flex gap-4">
                    <Form.Item name="unit_id" label="Unidad" className="w-full">
                      <SelectOrCreate
                        size="large"
                        placeholder="Unidad de venta"
                        onCreate={async (name) => {
                          const new_unit = await dispatch(productActions.units.add({ name }));
                          form.setFieldsValue({ unit_id: new_unit.unit_id });
                        }}
                        options={units?.data?.map((size) => ({
                          value: size.unit_id,
                          label: size?.name,
                        }))}
                      />
                    </Form.Item>
                    <Form.Item name="size_id" label="Tamaño" className="w-full">
                      <SelectOrCreate
                        size="large"
                        placeholder="Tamaño"
                        onCreate={async (name) => {
                          const new_size = await dispatch(productActions.sizes.add({ name }));
                          form.setFieldsValue({ size_id: new_size.size_id });
                        }}
                        options={sizes?.data?.map((size) => ({
                          value: size.size_id,
                          label: size?.short_name,
                        }))}
                      />
                    </Form.Item>
                  </div>

                  <Form.Item name="description" label="Descripción" className="mb-0">
                    <TextArea size="large" rows={2} placeholder="E.g: Helado de nuez" />
                  </Form.Item>
                </CardRoot>
              </Col>
            </Row>

            <Row gutter={[20, 20]} className="mb-5">
              <Col span={24}>
                <ExistencesTable setInventory={setInventory} inventory={inventory} />
              </Col>
            </Row>

            {permissions?.products?.edit_product?.value && (
              <Row gutter={[20, 20]}>
                <Col span={24}>
                  <PricesTable setPriceList={setPriceList} priceList={priceList} />
                </Col>
              </Row>
            )}
          </Form>

          {action === 'edit' && permissions?.products?.delete_product?.value && (
            <CardRoot title="Eliminar producto" className="my-5">
              <div className="flex flex-col md:flex-row gap-5 md:gap-8 justify-between items-center">
                <Typography.Text type="danger">
                  Una vez eliminado el producto, no se podrá recuperar la información.
                </Typography.Text>
                <Button
                  ghost
                  danger
                  size="large"
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
          )}
        </div>
      </div>
      {(!!permissions?.products?.add_product?.value || !!permissions?.products?.edit_product?.value) && (
        <Card
          className="rounded-none box-border absolute bottom-0 left-0 w-full"
          classNames={{ body: 'w-full flex items-center' }}
          styles={{ body: { padding: '0px', height: '80px' } }}
        >
          <div className="flex justify-end gap-6 max-w-[700px] mx-auto w-full px-4 lg:px-0">
            <Button size="large" className="w-full md:w-40" onClick={() => navigate(-1)} loading={loading}>
              Cancelar
            </Button>
            <Button type="primary" size="large" className="w-full md:w-40" onClick={onFinish} loading={loading}>
              {UI_TEXTS.saveBtn[action]}
            </Button>
          </div>
        </Card>
      )}
    </>
  );
};

export default ProductEditor;
