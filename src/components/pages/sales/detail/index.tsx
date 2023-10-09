import { APP_ROUTES } from '@/constants/routes';
import { useAppDispatch, useAppSelector } from '@/hooks/useStore';
import { theme } from '@/styles/theme/config';
import { MailOutlined, PhoneOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { Avatar, Breadcrumb, Card, Col, Typography, Row, Alert, Table, AlertProps, Button, Modal, InputNumber } from 'antd';
import Meta from 'antd/es/card/Meta';
import { ColumnsType } from 'antd/es/table';
import { Link } from 'react-router-dom';
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
import UpdateSaleButton from './update-sale-btn';
import PrintInvoiceButton from './print-invoice-btn';
import PopsicleIcon from '@/assets/img/jsx/popsicle';

type DataType = SaleItem;

const columns: ColumnsType<DataType> = [
  {
    title: '',
    dataIndex: 'products',
    width: 50,
    render: (_, record) => {
      let imageUrl = record?.products?.image_url ? BUCKETS.PRODUCTS.IMAGES`${record?.products?.image_url}` : null;
      return (
        <Avatar
          src={imageUrl || <PopsicleIcon style={{ width: 15 }} />}
          style={{ backgroundColor: '#eee', padding: imageUrl ? 0 : 5 }}
          size="large"
        />
      );
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
  const [amounts, setAmounts] = useState({ total: 0, subtotal: 0, pending: 0, cashback: 0, amount_paid: 0 });
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentItem, setCurrentItem] = useState<SaleItem>();
  const [newQuantity, setNewQuantity] = useState<number>(0);
  const [newPrice, setNewPrice] = useState(0);
  const [currentInput, setCurrentInput] = useState<'price' | 'quantity'>('price');
  const firstRender = useRef(false);
  const { isTablet } = useMediaQuery();
  const { metadata, items = [] } = current_sale;
  const currentProduct = currentItem?.products;

  useEffect(() => {
    if (!firstRender.current && metadata) {
      console.log('RENDER');
      firstRender.current = true;
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

  const onRowClick = (record: SaleItem) => {
    setCurrentItem(record);
    setNewQuantity(record?.quantity || 0);
    setNewPrice(record?.price || 0);
    setOpen(true);
  };

  const onAmountsChange = (value: number | null) => {
    if (currentInput === 'price') setNewPrice(value || 0);
    else if (currentInput === 'quantity') setNewQuantity(value || 0);
  };

  const closeModal = () => {
    setOpen(false);
  };

  const updateItem = async () => {
    setLoading(true);
    const result = await dispatch(salesActions.updateSaleItem({ ...currentItem, quantity: newQuantity, price: newPrice }));
    if (result) closeModal();
    setLoading(false);
  };

  const updateSale = (values: any) => {
    console.log(values);
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
                title: `Detalle de la venta (${current_sale?.metadata?.sale_id || '- - -'})`,
              },
            ]}
          />
        </Col>
      </Row>
      <Row style={{ marginTop: '20px' }} gutter={[20, 20]}>
        <Col lg={{ span: 8 }} xs={24}>
          <Card>
            <Row gutter={[10, 10]}>
              <Col span={12}>
                <Typography.Paragraph style={{ margin: '0' }}>
                  {`Subtotal: ${functions.money(amounts.subtotal)}`}
                </Typography.Paragraph>
                <Typography.Paragraph style={{ margin: '0' }}>{`Envío: ${functions.money(
                  metadata?.shipping,
                )}`}</Typography.Paragraph>
                {amounts.pending > 0 && (
                  <Typography.Paragraph style={{ margin: 0 }}>{`Pendiente: ${functions.money(
                    amounts.pending,
                  )}`}</Typography.Paragraph>
                )}
              </Col>
              <Col span={12} style={{ display: 'flex', alignItems: 'flex-end', flexDirection: 'column' }}>
                <Typography.Paragraph style={{ margin: 0 }}>{`Pagado: ${functions.money(
                  amounts.amount_paid,
                )}`}</Typography.Paragraph>

                <Typography.Paragraph style={{ margin: '0 0 10px' }}>
                  {`Cambio: ${functions.money(amounts.cashback)}`}
                </Typography.Paragraph>
              </Col>
            </Row>

            <Typography.Title level={2} style={{ margin: 0 }}>{`Total: ${functions.money(amounts?.total)}`}</Typography.Title>
          </Card>

          <Card style={{ marginTop: 20 }}>
            <Alert
              message={metadata?.status.name ?? '- - -'}
              action={metadata?.status_id === STATUS_DATA.COMPLETED.id ? functions.date1(metadata.created_at) : ''}
              type={ALERT_COLORS[metadata?.status_id ?? 6]}
              showIcon
              style={{ marginBottom: 15 }}
            />
            <Row gutter={[10, 10]}>
              <Col span={12}>
                <UpdateSaleButton amounts={amounts} />
              </Col>
              <Col span={12}>
                <PrintInvoiceButton amounts={amounts} />
              </Col>
            </Row>
          </Card>

          <Card
            // title={
            //   <Row style={{ display: 'flex', justifyContent: 'space-between' }}>
            //     <Typography.Title level={5} style={{ margin: 'auto 0' }}>
            //       Cliente
            //     </Typography.Title>
            //     {/* <Button icon={<EditOutlined rev={{}} />} type="ghost">
            //       Editar
            //     </Button> */}
            //   </Row>
            // }
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
                Actualizar
              </Button>
            </Col>
          </Row>,
        ]}
      >
        <ModalBody>
          <Avatar
            src={
              currentProduct?.image_url ? (
                BUCKETS.PRODUCTS.IMAGES`${currentProduct?.image_url}`
              ) : (
                <PopsicleIcon style={{ width: isTablet ? 25 : 47 }} />
              )
            }
            size={isTablet ? 60 : 100}
            style={{ background: '#e2e2e2', padding: 5 }}
            shape="circle"
          />
          <Typography.Title level={3} style={{ marginBottom: 0 }}>
            {currentProduct?.name}
          </Typography.Title>
          <Typography.Paragraph style={{ marginBottom: 5, textAlign: 'center' }}>
            {currentProduct?.categories?.name}
          </Typography.Paragraph>
          <Space height="10px" />

          <Row gutter={[10, 10]}>
            <Col span={12}>
              <Typography.Title level={5} style={{ textAlign: 'start', width: '100%' }}>
                Cantidad
              </Typography.Title>
              <InputNumber
                min={0}
                placeholder="Cantidad"
                size="large"
                style={{ width: '100%', textAlign: 'center' }}
                value={newQuantity}
                onPressEnter={updateItem}
                readOnly={isTablet}
                onFocus={target => {
                  setCurrentInput('quantity');
                  target.currentTarget.select();
                }}
                onChange={onAmountsChange}
              />
            </Col>
            <Col span={12}>
              <Typography.Title level={5} style={{ textAlign: 'start', width: '100%' }}>
                Precio
              </Typography.Title>
              <InputNumber
                min={0}
                placeholder="Precio"
                size="large"
                style={{ width: '100%', textAlign: 'center' }}
                value={newPrice}
                readOnly={isTablet}
                onFocus={target => {
                  setCurrentInput('price');
                  target.currentTarget.select();
                }}
                onChange={onAmountsChange}
              />
            </Col>
          </Row>

          <Space height="10px" />
          {isTablet && (
            <NumberKeyboard
              value={currentInput === 'price' ? newPrice : newQuantity}
              withDot={currentInput === 'price'}
              onChange={onAmountsChange}
            />
          )}
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
