import { FileProtectOutlined, PrinterOutlined } from '@ant-design/icons';
import { Button, Col, Drawer, Row, Typography } from 'antd';
import { useEffect, useRef, useState } from 'react';
import FallbackImage from '@/assets/img/webp/ice-cream.webp';
import functions from '@/utils/functions';
import { useAppSelector } from '@/hooks/useStore';
import { CustomTable, DrawerBody, FooterReceipt, ImageLogo, ProductCategory, ProductCell, ProductName } from './styles';
import { SaleItem } from '@/redux/reducers/sales/types';
import { format } from 'date-fns';
import { toPng } from 'html-to-image';

const paymentMethod: { [key: string]: string } = {
  CASH: 'Efectivo',
  TRANSFER: 'Transferencia',
  CARD: 'Tarjeta',
};

type PrintInvoiceButtonProps = {
  amounts: { total: number; subtotal: number; pending: number; cashback: number; amount_paid: number; discount?: string };
};

const PrintInvoiceButton = ({ amounts }: PrintInvoiceButtonProps) => {
  const { current_sale } = useAppSelector(({ sales }) => sales);
  const { metadata, items = [] } = current_sale;
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const elementRef = useRef<any>(null);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    let _totalItems = items?.reduce((total, item) => (item?.quantity || 0) + total, 0);
    setTotalItems(_totalItems);
  }, [items]);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const downloadInvoice = async () => {
    setLoading(true);
    try {
      const dataUrl = await toPng(elementRef?.current, { cacheBust: false });
      const link = document.createElement('a');
      link.download = `nota-${metadata?.sale_id}.png`;
      link.href = dataUrl;
      link.click();
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <>
      <Button type="default" icon={<FileProtectOutlined rev={{}} />} block size="large" onClick={showDrawer} loading={loading}>
        Ver nota
      </Button>

      <Drawer
        title="Nota de la venta"
        width={380}
        placement="right"
        onClose={onClose}
        open={open}
        styles={{ body: { padding: 0 } }}
        extra={
          <Button onClick={downloadInvoice} icon={<PrinterOutlined rev={{}} />}>
            Imprimir
          </Button>
        }
      >
        <DrawerBody ref={elementRef}>
          <Typography.Title level={5} style={{ textAlign: 'center', margin: '0 0 10px' }}>
            NOTA DE VENTA
          </Typography.Title>
          <Row style={{ padding: '10px 10px 5px', borderTop: '1px dashed gray' }}>
            <Col
              span={12}
              style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', flexDirection: 'column' }}
            >
              <Typography.Paragraph style={{ fontSize: 12, fontWeight: 400, margin: '0 0 10px' }}>
                Fecha: {functions.currentDate()}
              </Typography.Paragraph>
              <Typography.Paragraph style={{ fontSize: 12, fontWeight: 800, margin: 0 }}>Cliente:</Typography.Paragraph>
              <Typography.Paragraph style={{ fontSize: 12, fontWeight: 400, margin: 0 }}>
                {metadata?.customers?.name || '- - -'}
              </Typography.Paragraph>
              <Typography.Paragraph style={{ fontSize: 12, fontWeight: 400, margin: 0 }}>
                {metadata?.customers?.phone || '- - -'}
              </Typography.Paragraph>
            </Col>
            <Col span={12} style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
              <ImageLogo src={FallbackImage} alt="Paleteria deliz" />
            </Col>
          </Row>
          <CustomTable
            columns={[
              {
                title: 'Producto',
                dataIndex: 'products',
                render: (_, record: SaleItem) => {
                  return (
                    <div>
                      <ProductName>{record?.products?.name ?? '- - -'}</ProductName>
                      <ProductCategory>{record?.products?.categories?.name ?? '- - -'}</ProductCategory>
                    </div>
                  );
                },
              },
              {
                title: 'Cantidad',
                dataIndex: 'quantity',
                align: 'center',
                render: (value: number) => <ProductCell> {value}</ProductCell>,
              },
              {
                title: 'Precio',
                dataIndex: 'price',
                align: 'center',
                render: (value: number) => <ProductCell> {functions.money(value)}</ProductCell>,
              },
              {
                title: 'Total',
                dataIndex: 'retail_price',
                align: 'center',
                render: (_: number, record: SaleItem) => (
                  <ProductCell>{functions.money((record.quantity || 0) * (record.price || 0))}</ProductCell>
                ),
              },
            ]}
            dataSource={items}
            size="small"
            pagination={false}
          />
          <Row style={{ padding: '10px', display: 'flex', justifyContent: 'flex-end' }}>
            <Col span={12} style={{ textAlign: 'start' }}>
              <Typography.Paragraph style={{ fontSize: 12, fontWeight: 400, margin: 0 }}>
                Productos: {totalItems}
              </Typography.Paragraph>
            </Col>
            <Col span={12} style={{ textAlign: 'end' }}>
              <Typography.Paragraph style={{ fontSize: 12, fontWeight: 400, margin: 0 }}>
                Subtotal: {functions.money(amounts?.subtotal || 0)}
              </Typography.Paragraph>
              <Typography.Paragraph style={{ fontSize: 12, fontWeight: 400, margin: 0 }}>
                Envio: {functions.money(metadata?.shipping || 0)}
              </Typography.Paragraph>
              <Typography.Paragraph style={{ fontSize: 12, fontWeight: 400, margin: 0 }}>
                Descuento: {amounts?.discount}
              </Typography.Paragraph>
              <Typography.Paragraph style={{ fontSize: 13, fontWeight: 800, margin: 0 }}>
                TOTAL: {functions.money(amounts?.total || 0)}
              </Typography.Paragraph>
            </Col>
          </Row>
          <FooterReceipt>
            <Typography.Paragraph type="secondary" style={{ fontSize: 12, fontWeight: 400, margin: 0 }}>
              Forma de pago: {paymentMethod[metadata?.payment_method || ''] || '- - -'}
            </Typography.Paragraph>
            <Typography.Paragraph type="secondary" style={{ fontSize: 12, fontWeight: 400, margin: 0 }}>
              Estatus de la venta: {metadata?.status?.name || '- - -'}
            </Typography.Paragraph>
            <Typography.Paragraph type="secondary" style={{ fontSize: 12, fontWeight: 400, margin: 0 }}>
              PALETERIA D'ELIZ
            </Typography.Paragraph>
            <Typography.Paragraph type="secondary" style={{ fontSize: 12, fontWeight: 400, margin: 0 }}>
              Caxuxi Hgo. 42640
            </Typography.Paragraph>
            <Typography.Paragraph type="secondary" style={{ fontSize: 12, fontWeight: 400, margin: 0 }}>
              Contacto: +52 (771) 176 3694
            </Typography.Paragraph>

            <Typography.Paragraph type="secondary" style={{ fontSize: 12, fontWeight: 400, margin: '20px 0 10px' }}>
              ¡GRACIAS POR SU COMPRA!
            </Typography.Paragraph>
          </FooterReceipt>
        </DrawerBody>
      </Drawer>
    </>
  );
};

export default PrintInvoiceButton;
