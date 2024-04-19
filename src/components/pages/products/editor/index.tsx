import Upload from '@/components/atoms/UploadFile';
import { APP_ROUTES } from '@/routes/routes';
import { STATUS } from '@/constants/status';
import { useAppDispatch, useAppSelector } from '@/hooks/useStore';
import { productActions } from '@/redux/reducers/products';
import { Product } from '@/redux/reducers/products/types';
import { Breadcrumb, Button, Card, Col, Form, Input, InputNumber, Modal, Row, Select, UploadFile, message } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { DeleteOutlined } from '@ant-design/icons';
import functions from '@/utils/functions';

type Params = {
  action: 'edit' | 'add';
};

const UI_TEXTS = {
  breadcrumb: { edit: 'Editar producto', add: 'Agregar nuevo producto' },
  saveBtn: { edit: 'Guardar cambios', add: 'Guardar' },
};

const { TextArea } = Input;

const ProductEditor = () => {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  let { action = 'add' } = useParams<Params>();
  const [loading, setLoading] = useState(false);
  const { current_product, sizes, units, categories } = useAppSelector(({ products }) => products);
  const [productImages, setProductImages] = useState<UploadFile[]>([]);
  const firstRender = useRef<boolean>(false);

  useEffect(() => {
    if (!categories?.length) {
      dispatch(productActions.fetchCategories({ refetch: true }));
    }
    if (!sizes?.data?.length) {
      dispatch(productActions.sizes.get({ refetch: true }));
    }
    if (!units?.data?.length) {
      dispatch(productActions.units.get({ refetch: true }));
    }
  }, [categories, sizes, dispatch]);

  useEffect(() => {
    if (current_product?.image_url) {
      setProductImages([
        {
          uid: 'DEFAULT_IMAGE',
          name: 'DEFAULT_IMAGE',
          status: 'done',
          url: current_product.image_url,
        },
      ]);
    }
  }, [current_product?.image_url]);

  const saveNewProduct = async (values: Product) => {
    let img = productImages[0];
    let image_url: string | boolean = '';

    if (img?.originFileObj) image_url = await productActions.saveImage(img?.originFileObj);
    if (typeof image_url === 'string') {
      await dispatch(productActions.saveProduct({ ...values, image_url }));
    }
  };

  const saveEditionProduct = async (values: Product) => {
    let img = productImages[0];
    let image_url: string | boolean = '';
    if (img?.originFileObj?.uid && img?.originFileObj?.uid !== 'DEFAULT_IMAGE') {
      image_url = await productActions.replaceImage(img?.originFileObj, current_product.image_url as string);
    }
    if (typeof image_url === 'string') {
      await dispatch(productActions.updateProduct(values, image_url));
    }
  };

  const onFinish = async (values: Product) => {
    if (!values.name) return message.warning('Agrega un nombre al producto');

    setLoading(true);

    let code = functions.getCode(values);
    let product = { ...values, code };

    if (action === 'add') await saveNewProduct(product);
    else if (action === 'edit') await saveEditionProduct(product);

    setLoading(false);
    form.resetFields();
  };

  const onImageChange = (files: UploadFile[]) => {
    // if (!files.length) return null;
    setProductImages(files);
  };

  const confirmDelete = async () => {
    setLoading(true);
    await dispatch(productActions.deleteProduct(current_product));
    setLoading(false);
  };

  const onDelete = async () => {
    Modal.confirm({
      title: 'Eliminar',
      content: '¿Desea eliminar este elemento?',
      onOk: confirmDelete,
      okText: 'Confirmar',
      cancelText: 'Cancelar',
      footer: (_, { OkBtn, CancelBtn }) => (
        <>
          <CancelBtn />
          <OkBtn />
        </>
      ),
    });
  };

  return (
    <div>
      <Row justify="space-between">
        <Col span={24}>
          <Breadcrumb
            items={[
              {
                title: <Link to={APP_ROUTES.PRIVATE.DASHBOARD.HOME.path}>{APP_ROUTES.PRIVATE.DASHBOARD.HOME.title}</Link>,
                key: 'dashboard',
              },
              {
                title: <Link to={APP_ROUTES.PRIVATE.DASHBOARD.PRODUCTS.path}>{APP_ROUTES.PRIVATE.DASHBOARD.PRODUCTS.title}</Link>,
                key: 'products',
              },
              {
                title: UI_TEXTS.breadcrumb[action],
              },
            ]}
          />
        </Col>
      </Row>
      <Row style={{ marginTop: '20px' }}>
        <Col span={24}>
          <Card
            title={UI_TEXTS.breadcrumb[action]}
            extra={
              action === 'edit' ? (
                <Button type="primary" danger icon={<DeleteOutlined rev={{}} />} onClick={onDelete} loading={loading}>
                  Eliminar
                </Button>
              ) : null
            }
          >
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
              <Row gutter={[20, 5]}>
                <Col lg={{ span: 12 }} xs={{ span: 24 }}>
                  <Form.Item name="image_url" label="Upload">
                    <Upload onChange={onImageChange} defaultFileList={productImages} />
                  </Form.Item>
                  <Form.Item name="name" label="Nombre" rules={[{ required: true }]}>
                    <Input size="large" placeholder="E.g: Helado de nuez" />
                  </Form.Item>
                  <Form.Item name="description" label="Descripción">
                    <TextArea size="large" rows={4} placeholder="E.g: Helado de nuez" />
                  </Form.Item>
                </Col>
                <Col lg={{ span: 12 }} xs={{ span: 24 }}>
                  <Row gutter={[20, 5]}>
                    <Col lg={{ span: 12 }} sm={{ span: 12 }} xs={{ span: 24 }}>
                      <Form.Item name="retail_price" label="Precio menudeo" rules={[{ type: 'number', min: 0, required: true }]}>
                        <InputNumber size="large" prefix="$" style={{ width: '100%' }} placeholder="0.0" />
                      </Form.Item>
                      <Form.Item name="status" label="Status" rules={[{ required: true }]}>
                        <Select size="large" placeholder="Por default es Activo" virtual={false}>
                          {STATUS.map(item => (
                            <Select.Option key={item.id} value={item.id}>
                              {item.name}
                            </Select.Option>
                          ))}
                        </Select>
                      </Form.Item>
                      <Form.Item name="stock" label="Stock" rules={[{ type: 'number', min: 0, required: true }]}>
                        <InputNumber size="large" style={{ width: '100%' }} placeholder="0" />
                      </Form.Item>
                      <Form.Item name="unit_id" label="Unidad" rules={[{ required: true }]}>
                        <Select
                          size="large"
                          placeholder="Grande"
                          virtual={false}
                          options={units?.data?.map(size => ({ value: size.unit_id, label: size?.short_name }))}
                        />
                      </Form.Item>
                    </Col>
                    <Col lg={{ span: 12 }} sm={{ span: 12 }} xs={{ span: 24 }}>
                      <Form.Item
                        name="wholesale_price"
                        label="Precio mayoreo"
                        rules={[{ type: 'number', min: 0, required: true }]}
                      >
                        <InputNumber size="large" prefix="$" style={{ width: '100%' }} placeholder="0.0" />
                      </Form.Item>
                      <Form.Item name="category_id" label="Categoría" rules={[{ required: true }]}>
                        <Select
                          size="large"
                          placeholder="Selecciona una categoría"
                          showSearch
                          style={{ width: '100%' }}
                          optionFilterProp="children"
                          virtual={false}
                          filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                          options={categories?.map(i => ({ value: i.category_id, label: i.name }))}
                        />
                      </Form.Item>
                      <Form.Item name="size_id" label="Tamaño" rules={[{ required: true }]}>
                        <Select
                          size="large"
                          placeholder="Grande"
                          virtual={false}
                          options={sizes?.data?.map(size => ({ value: size.size_id, label: size?.short_name }))}
                        />
                      </Form.Item>
                      <Form.Item name="code" label="Código">
                        <Input size="large" placeholder="PAML01" />
                      </Form.Item>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Form.Item>
                <Button block type="primary" size="large" htmlType="submit" loading={loading}>
                  {UI_TEXTS.saveBtn[action]}
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ProductEditor;
