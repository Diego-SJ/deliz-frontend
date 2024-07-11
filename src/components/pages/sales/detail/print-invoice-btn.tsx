import { FileProtectOutlined, PrinterOutlined, WhatsAppOutlined } from '@ant-design/icons';
import { Button, Col, Drawer, Row, Typography, message } from 'antd';
import { useEffect, useRef, useState } from 'react';
import FallbackImage from '@/assets/img/webp/logo-deliz.webp';
import functions from '@/utils/functions';
import { useAppSelector } from '@/hooks/useStore';
import { CustomTable, DrawerBody, FooterReceipt, ImageLogo, ProductCategory, ProductCell, ProductName } from './styles';
import { SaleItem } from '@/redux/reducers/sales/types';
import { toPng, toBlob } from 'html-to-image';
import useWhatsappApi from '@/hooks/useWhatsappAPI';
import { cashierHelpers } from '@/utils/cashiers';

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
  const { sendMessage, loading: messageLoading } = useWhatsappApi();
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
      const dataUrl = await toPng(elementRef?.current, { cacheBust: false, quality: 0.5 });
      const link = document.createElement('a');
      link.id = 'download-link';
      link.download = `Nota: ${metadata?.customers?.name} - ${metadata?.sale_id}.jpeg`;
      link.href = dataUrl;
      link.click();
      link.remove();
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const sendNoteByWhatsapp = async () => {
    if (!cashierHelpers.isValidPhone(metadata?.customers?.phone || '')) {
      message.error('El número de Whatsapp no es válido');
      return;
    }

    const file = await toBlob(elementRef?.current, { cacheBust: false, quality: 0.5 });
    const text = `Hola ${current_sale?.metadata?.customers?.name}, aquí tienes tu nota de venta. Gracias por tu compra.`;
    const number = current_sale?.metadata?.customers?.phone || '';
    sendMessage(number, text, new File([file as Blob], 'nota.png', { type: 'image/png' }));
  };

  return (
    <>
      <Button type="default" icon={<FileProtectOutlined />} block size="large" onClick={showDrawer} loading={loading}>
        Ver nota
      </Button>

      <Drawer
        title="Nota de la venta"
        width={380}
        placement="right"
        onClose={onClose}
        open={open}
        styles={{ body: { padding: 0 } }}
      >
        <div className="flex gap-4 px-6 justify-center pt-4">
          <Button onClick={downloadInvoice} icon={<PrinterOutlined />}>
            Imprimir
          </Button>
          <Button onClick={sendNoteByWhatsapp} icon={<WhatsAppOutlined />} loading={messageLoading}>
            Enviar via Whatsapp
          </Button>
        </div>
        <DrawerBody ref={elementRef}>
          <Typography.Title level={5} style={{ textAlign: 'center', margin: '0 0 10px' }}>
            NOTA DE VENTA
          </Typography.Title>
          <Row style={{ padding: '10px 10px 5px', borderTop: '1px dashed gray' }}>
            <Col
              span={16}
              style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', flexDirection: 'column' }}
            >
              <Typography.Paragraph style={{ fontSize: 12, fontWeight: 400, margin: '0 0 10px' }}>
                Fecha: {functions.tableDate(current_sale?.metadata?.created_at || '')}
              </Typography.Paragraph>
              <Typography.Paragraph style={{ fontSize: 12, fontWeight: 800, margin: 0 }}>Cliente:</Typography.Paragraph>
              <Typography.Paragraph style={{ fontSize: 12, fontWeight: 400, margin: 0 }}>
                {metadata?.customers?.name || '- - -'}
              </Typography.Paragraph>
              <Typography.Paragraph style={{ fontSize: 12, fontWeight: 400, margin: 0 }}>
                {metadata?.customers?.phone || '- - -'}
              </Typography.Paragraph>
            </Col>
            <Col span={8} style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
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
              <Typography.Paragraph style={{ fontSize: 12, fontWeight: 400, margin: 0 }}>
                Cambio: {functions.money(current_sale?.metadata?.cashback || 0)}
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
