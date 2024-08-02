import { FileProtectOutlined, PrinterOutlined, WhatsAppOutlined } from '@ant-design/icons';
import { Avatar, Button, Col, Drawer, Row, Typography, message } from 'antd';
import { useEffect, useRef, useState } from 'react';
import FallbackImage from '@/assets/img/webp/logo-deliz.webp';
import functions from '@/utils/functions';
import { useAppSelector } from '@/hooks/useStore';
import { CustomTable, DrawerBody, FooterReceipt, ImageLogo } from './styles';
import { SaleItem } from '@/redux/reducers/sales/types';
import { toPng, toBlob } from 'html-to-image';
import useWhatsappApi from '@/hooks/useWhatsappAPI';
import { cashierHelpers } from '@/utils/cashiers';
import useMediaQuery from '@/hooks/useMediaQueries';
import { PAYMENT_METHOD_SHORT_NAME } from '@/constants/payment_methods';
import { Branch, CashRegister } from '@/redux/reducers/branches/type';

type PrintInvoiceButtonProps = {
  amounts: { total: number; subtotal: number; pending: number; cashback: number; amount_paid: number; discount?: number };
};

const PrintInvoiceButton = ({ amounts }: PrintInvoiceButtonProps) => {
  const { current_sale } = useAppSelector(({ sales }) => sales);
  const { company } = useAppSelector(({ app }) => app);
  const { sendMessage, loading: messageLoading } = useWhatsappApi();
  const { metadata, items = [] } = current_sale;
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const elementRef = useRef<any>(null);
  const [totalItems, setTotalItems] = useState(0);
  const { isTablet } = useMediaQuery();
  const saleBranch = (current_sale?.metadata as any)?.branches as Branch;
  const saleCashRegister = (current_sale?.metadata as any)?.cash_registers as CashRegister;

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
      <Button
        size={isTablet ? 'large' : 'middle'}
        type="default"
        icon={<FileProtectOutlined />}
        block
        onClick={showDrawer}
        loading={loading}
      >
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
                Fecha: {functions.formatToLocalTimezone(current_sale?.metadata?.created_at?.toString() || '')}
              </Typography.Paragraph>
              <Typography.Paragraph style={{ fontSize: 12, fontWeight: 800, margin: 0 }}>Cliente:</Typography.Paragraph>
              <Typography.Paragraph style={{ fontSize: 12, fontWeight: 400, margin: 0 }}>
                {metadata?.customers?.name || 'Público General'}
              </Typography.Paragraph>
              <Typography.Paragraph style={{ fontSize: 12, fontWeight: 400, margin: 0 }}>
                {metadata?.customers?.phone || 'Tel.: N/A'}
              </Typography.Paragraph>
            </Col>
            <Col span={8} style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
              <Avatar src={company?.logo_url || FallbackImage} className="w-20 h-20 min-w-20 bg-slate-100 p-2" shape="circle" />
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
                      <p className="text-sm text-slate-600">{record?.products?.name ?? '- - -'}</p>
                      <span className="block text-xs text-slate-400">
                        {record?.products?.categories?.name || 'Sin categoría'}
                      </span>
                    </div>
                  );
                },
              },
              {
                title: 'Cantidad',
                dataIndex: 'quantity',
                align: 'center',
                render: (value: number) => <span className="block text-xs text-slate-600"> {value}</span>,
              },
              {
                title: 'Precio',
                dataIndex: 'price',
                align: 'center',
                render: (value: number) => <span className="block text-xs text-slate-600"> {functions.money(value)}</span>,
              },
              {
                title: 'Total',
                dataIndex: 'retail_price',
                align: 'center',
                render: (_: number, record: SaleItem) => (
                  <span className="block text-xs text-slate-600">
                    {functions.money((record.quantity || 0) * (record.price || 0))}
                  </span>
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
                {`Descuento:  ${metadata?.discount_type === 'AMOUNT' ? '$' : ''}${amounts?.discount}${
                  metadata?.discount_type === 'PERCENTAGE' ? '%' : ''
                }`}
              </Typography.Paragraph>
              <Typography.Paragraph style={{ fontSize: 13, fontWeight: 800, margin: 0 }}>
                TOTAL: {functions.money(amounts?.total || 0)}
              </Typography.Paragraph>
            </Col>
          </Row>
          <FooterReceipt>
            <Typography.Paragraph type="secondary" style={{ fontSize: 12, fontWeight: 400, margin: 0 }}>
              Forma de pago: {PAYMENT_METHOD_SHORT_NAME[metadata?.payment_method || ''] || '- - -'}
            </Typography.Paragraph>
            <Typography.Paragraph type="secondary" style={{ fontSize: 12, fontWeight: 400, margin: 0 }}>
              Estatus de la venta: {metadata?.status?.name || '- - -'}
            </Typography.Paragraph>
            <Typography.Paragraph className="uppercase" type="secondary" style={{ fontSize: 12, fontWeight: 400, margin: 0 }}>
              {company?.name || '- - -'}
            </Typography.Paragraph>
            <Typography.Paragraph type="secondary" style={{ fontSize: 12, fontWeight: 400, margin: 0 }}>
              Sucursal {saleBranch?.name || '- - -'}
            </Typography.Paragraph>
            <Typography.Paragraph type="secondary" style={{ fontSize: 12, fontWeight: 400, margin: 0 }}>
              Caja {saleCashRegister?.name || '- - -'}
            </Typography.Paragraph>
            <Typography.Paragraph type="secondary" style={{ fontSize: 12, fontWeight: 400, margin: 0 }}>
              {cashierHelpers.getAddress(saleBranch)}
            </Typography.Paragraph>
            <Typography.Paragraph type="secondary" style={{ fontSize: 12, fontWeight: 400, margin: 0 }}>
              Contacto: {saleBranch?.phone || 'Tel.: N/A'}
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
