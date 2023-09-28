import { APP_ROUTES } from '@/constants/routes';
import { useAppDispatch, useAppSelector } from '@/hooks/useStore';
import { theme } from '@/styles/theme/config';
import { MailOutlined, PhoneOutlined, EnvironmentOutlined, EditOutlined } from '@ant-design/icons';
import {
  Avatar,
  Breadcrumb,
  Card,
  Col,
  Typography,
  Row,
  Alert,
  Table,
  AlertProps,
  Button,
  Modal,
  Form,
  InputNumber,
  Radio,
} from 'antd';
import Meta from 'antd/es/card/Meta';
import { ColumnsType } from 'antd/es/table';
import { Link } from 'react-router-dom';
import PopsicleImg from '@/assets/img/png/popsicle.png';
import functions from '@/utils/functions';
import { useEffect, useRef, useState } from 'react';
import { salesActions } from '@/redux/reducers/sales';
import { SaleItem } from '@/redux/reducers/sales/types';
import { STATUS, STATUS_DATA } from '@/constants/status';
import { BUCKETS } from '@/constants/buckets';
import { ModalBody } from '../../cash-register/styles';
import FallbackImage from '@/assets/img/png/Logo Color.png';
import Space from '@/components/atoms/Space';
import useMediaQuery from '@/hooks/useMediaQueries';
import NumberKeyboard from '@/components/atoms/NumberKeyboard';

type DataType = SaleItem;

const columns: ColumnsType<DataType> = [
  {
    title: '',
    dataIndex: 'products',
    width: 50,
    render: (_, record) => {
      let imageUrl = record?.products?.image_url ? BUCKETS.PRODUCTS.IMAGES`${record?.products?.image_url}` : null;
      return <Avatar src={imageUrl || PopsicleImg} style={{ backgroundColor: '#eee', padding: imageUrl ? 0 : 5 }} size="large" />;
    },
  },
  {
    title: 'Producto',
    dataIndex: 'products',
    render: (_, record) => {
      return (
        <div>
          <b>{record?.products?.name ?? '- - -'}</b>
          <br />
          <span>{record?.products?.categories?.name ?? '- - -'}</span>
        </div>
      );
    },
  },
  {
    title: 'Cantidad',
    dataIndex: 'quantity',
  },
  {
    title: 'Precio',
    dataIndex: 'price',
    render: (value: number) => functions.money(value),
  },
  {
    title: 'Total',
    dataIndex: 'retail_price',
    render: (_: number, record) => functions.money((record.quantity || 0) * (record.price || 0)),
  },
];

const SaleDetail = () => {
  const dispatch = useAppDispatch();
  const { current_sale } = useAppSelector(({ sales }) => sales);
  const [amounts, setAmounts] = useState({ total: 0, subtotal: 0, color: 'info', pending: 0, cashback: 0, amount_paid: 0 });
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentItem, setCurrentItem] = useState<SaleItem>();
  const [quantity, setQuantity] = useState<number | string>(0);
  const [checked, setChecked] = useState(true);
  const [form] = Form.useForm();
  const firstRender = useRef(false);
  const { isTablet } = useMediaQuery();
  const { metadata, items = [] } = current_sale;
  const currentProduct = currentItem?.products;

  useEffect(() => {
    if (!firstRender.current && metadata) {
      firstRender.current = true;
      console.log(metadata);
      dispatch(salesActions.getSaleById({ sale_id: metadata.sale_id, refetch: true }));
      return;
    }
  }, [metadata]);

  useEffect(() => {
    let subtotal = items?.reduce((acum, item) => acum + (item?.price || 0) * (item?.quantity || 0), 0);
    let color = STATUS.find(item => item.id === metadata?.status_id)?.color ?? 'info';
    let total = subtotal + (metadata?.shipping || 0);
    const _amounts = {
      color,
      subtotal,
      cashback: metadata?.cashback || 0,
      amount_paid: metadata?.amount_paid || 0,
      pending: total - (metadata?.amount_paid || 0),
      total: total,
    };
    setAmounts(_amounts);
  }, [items, metadata]);

  const onFinish = (values: any) => {
    console.log(values);
  };

  const closeModal = () => {
    setOpen(false);
  };

  const updateItem = () => {};

  const onRowClick = (record: SaleItem) => {
    setCurrentItem(record);
    setQuantity(record?.quantity || 0);
    setOpen(true);
  };

  const onQuantityChange = (value: number) => {
    setQuantity(value);
  };

  const onCheckChange = (value: boolean) => {
    setChecked(value);
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
                title: <Link to={APP_ROUTES.PRIVATE.DASHBOARD.SALES.path}>{APP_ROUTES.PRIVATE.DASHBOARD.SALES.title}</Link>,
                key: 'Ventas',
              },
              {
                title: `Detalle de la venta`,
              },
            ]}
          />
        </Col>
      </Row>
      <Row style={{ marginTop: '20px' }} gutter={[20, 20]}>
        <Col lg={{ span: 8 }} xs={24}>
          <Card>
            <Typography.Title level={2}>{`Total: ${functions.money(amounts?.total)}`}</Typography.Title>
            <Typography.Paragraph style={{ margin: 0 }}>{`Envío: ${functions.money(metadata?.shipping)}`}</Typography.Paragraph>
            <Typography.Paragraph style={{ margin: '0 0 10px' }}>{`Subtotal: ${functions.money(
              amounts.subtotal,
            )}`}</Typography.Paragraph>
            <Typography.Paragraph style={{ margin: 0 }}>{`Pagado: ${functions.money(amounts.amount_paid)}`}</Typography.Paragraph>
            <Typography.Paragraph style={{ margin: 0 }}>{`Pendiente: ${functions.money(amounts.pending)}`}</Typography.Paragraph>
            <Typography.Paragraph style={{ margin: '0 0 10px' }}>{`Cambio: ${functions.money(
              amounts.cashback,
            )}`}</Typography.Paragraph>
            <Alert
              message={metadata?.status.name ?? '- - -'}
              action={metadata?.status_id === STATUS_DATA.COMPLETED.id ? functions.date1(metadata.created_at) : ''}
              type={ALERT_COLORS[metadata?.status_id ?? 6]}
              showIcon
            />
          </Card>
          <Card
            title={
              <Row style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography.Title level={5} style={{ margin: 'auto 0' }}>
                  Cliente
                </Typography.Title>
                <Button icon={<EditOutlined rev={{}} />} type="ghost">
                  Editar
                </Button>
              </Row>
            }
            style={{ marginTop: 20 }}
          >
            <Meta
              avatar={
                <Avatar src="https://xsgames.co/randomusers/avatar.php?g=pixel&key=1" size={55} style={{ background: '#eee' }} />
              }
              title={metadata?.customers?.name ?? '- - -'}
              description="Cliente"
            />
            <Col style={{ marginTop: 15 }}>
              <Row align="middle">
                <PhoneOutlined rev={{}} style={{ fontSize: 20, color: theme.colors.primary, marginRight: 10 }} />
                <Typography.Paragraph
                  style={{ margin: '10px 0' }}
                  type="secondary"
                  copyable={{ tooltips: ['Copiar', '¡Copiado!'] }}
                >
                  {metadata?.customers?.phone ?? '- - -'}
                </Typography.Paragraph>
              </Row>
              <Row align="middle">
                <MailOutlined rev={{}} style={{ fontSize: 20, color: theme.colors.primary, marginRight: 10 }} />
                <Typography.Paragraph
                  style={{ margin: '10px 0' }}
                  type="secondary"
                  copyable={{ tooltips: ['Copiar', '¡Copiado!'] }}
                >
                  {metadata?.customers?.email ?? '- - -'}
                </Typography.Paragraph>
              </Row>
              <Row align="middle">
                <EnvironmentOutlined rev={{}} style={{ fontSize: 20, color: theme.colors.primary, marginRight: 10 }} />
                <Typography.Paragraph
                  style={{ margin: '10px 0' }}
                  type="secondary"
                  copyable={{ tooltips: ['Copiar', '¡Copiado!'] }}
                >
                  {metadata?.customers?.address ?? '- - -'}
                </Typography.Paragraph>
              </Row>
            </Col>
          </Card>
        </Col>
        <Col lg={{ span: 16 }} xs={24}>
          <Table
            columns={columns}
            dataSource={items}
            size="small"
            scroll={{ y: 'calc(100vh - 250px)', x: 600 }}
            pagination={false}
            onRow={record => ({
              onClick: () => onRowClick(record),
            })}
          />
        </Col>
      </Row>
      <Modal
        open={open}
        onCancel={closeModal}
        maskClosable={false}
        destroyOnClose
        width={380}
        footer={[
          <Row key="actions" gutter={10}>
            <Col span={12}>
              <Button key="back" size="large" block onClick={closeModal} loading={loading}>
                Cancelar
              </Button>
            </Col>
            <Col span={12}>
              <Button block type="primary" onClick={updateItem} size="large" loading={loading}>
                Guardar
              </Button>
            </Col>
          </Row>,
        ]}
      >
        <ModalBody>
          <Avatar
            src={currentProduct?.image_url || FallbackImage}
            size={100}
            style={{ background: 'white', padding: !!currentProduct?.image_url ? 0 : 5 }}
            shape="circle"
          />
          <Typography.Title level={3} style={{ marginBottom: 0 }}>
            {currentProduct?.name}
          </Typography.Title>
          <Typography.Paragraph style={{ marginBottom: 5, textAlign: 'center' }}>
            {currentProduct?.categories?.name}
          </Typography.Paragraph>
          <Typography.Title level={4} type="success" style={{ margin: 0 }}>
            {functions.money(currentItem?.price)} * {quantity} = {functions.money((currentItem?.price || 0) * Number(quantity))}
          </Typography.Title>
          <Space height="10px" />

          <Radio.Group style={{ width: '100%' }} size="large" value={checked} onChange={e => onCheckChange(e.target.value)}>
            <Radio.Button value={true} style={{ width: '50%', textAlign: 'center' }}>
              Mayoreo
            </Radio.Button>
            <Radio.Button value={false} style={{ width: '50%', textAlign: 'center' }}>
              Menudeo
            </Radio.Button>
          </Radio.Group>
          <Space height="10px" />
          <InputNumber
            min={0}
            placeholder="Cantidad"
            size="large"
            style={{ width: '100%', textAlign: 'center' }}
            value={quantity}
            onPressEnter={updateItem}
            readOnly={isTablet}
            onChange={value => onQuantityChange(value as number)}
          />
          <Space height="10px" />
          {isTablet && <NumberKeyboard onChange={onQuantityChange} />}
        </ModalBody>
      </Modal>
    </div>
  );
};

const ALERT_COLORS: { [key: number]: AlertProps['type'] } = {
  4: 'success', // Completed
  5: 'warning', // Pending
  6: 'error', // Canceled
};

export default SaleDetail;
