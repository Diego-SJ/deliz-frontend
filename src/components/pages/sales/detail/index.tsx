import { APP_ROUTES } from '@/constants/routes';
import { useAppDispatch, useAppSelector } from '@/hooks/useStore';
import { theme } from '@/styles/theme/config';
import { MailOutlined, PhoneOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { Avatar, Breadcrumb, Card, Col, Typography, Row, Alert, Table, AlertProps } from 'antd';
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

type DataType = SaleItem;

const columns: ColumnsType<DataType> = [
  {
    title: 'Producto',
    dataIndex: 'products',
    render: (_, record) => {
      let imageUrl = record?.products?.image_url ? BUCKETS.PRODUCTS.IMAGES`${record?.products?.image_url}` : null;
      return (
        <Row align="middle" gutter={10}>
          <Col>
            <Avatar src={imageUrl || PopsicleImg} style={{ backgroundColor: '#eee', padding: imageUrl ? 0 : 5 }} size="large" />
          </Col>
          <Col>
            <b>{record?.products?.name ?? '- - -'}</b>
            <br />
            <span>{record?.products?.categories?.name ?? '- - -'}</span>
          </Col>
        </Row>
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
  const { metadata, items = [] } = current_sale;
  const [amounts, setAmounts] = useState({ total: 0, subtotal: 0, color: 'info' });
  const firstRender = useRef(false);

  useEffect(() => {
    if (!firstRender.current && metadata) {
      firstRender.current = true;

      dispatch(salesActions.getSaleById({ sale_id: metadata.sale_id }));
      return;
    }
  }, [metadata]);

  useEffect(() => {
    let subtotal = items?.reduce((acum, item) => acum + (item?.price || 0) * (item?.quantity || 0), 0);
    let color = STATUS.find(item => item.id === metadata?.status_id)?.color ?? 'info';
    setAmounts({ total: subtotal + (metadata?.shipping || 0), subtotal, color });
  }, [items, metadata]);

  const onFinish = (values: any) => {
    console.log(values);
  };

  return (
    <div>
      <Row justify="space-between">
        <Col span={8}>
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
        <Col span={8}>
          <Card>
            <Typography.Title level={2}>{`Total: ${functions.money(amounts?.total)}`}</Typography.Title>
            <Typography.Paragraph>{`Envío: ${functions.money(metadata?.shipping)}`}</Typography.Paragraph>
            <Typography.Paragraph>{`Subtotal: ${functions.money(amounts.subtotal)}`}</Typography.Paragraph>
            <Alert
              message={metadata?.status.name ?? '- - -'}
              action={metadata?.status_id === STATUS_DATA.COMPLETED.id ? functions.date1(metadata.created_at) : ''}
              type={ALERT_COLORS[metadata?.status_id ?? 6]}
              showIcon
            />
          </Card>
          <Card title="Cliente" style={{ marginTop: 20 }}>
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
        <Col span={16}>
          <Table columns={columns} dataSource={items} size="small" />
        </Col>
      </Row>
    </div>
  );
};

const ALERT_COLORS: { [key: number]: AlertProps['type'] } = {
  4: 'success', // Completed
  5: 'warning', // Pending
  6: 'error', // Canceled
};

export default SaleDetail;
