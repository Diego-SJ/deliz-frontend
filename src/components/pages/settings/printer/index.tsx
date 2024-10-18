import { useAppDispatch, useAppSelector } from '@/hooks/useStore';
import { Alert, App, Button, Typography } from 'antd';
import BreadcrumbSettings from '../../settings/menu/breadcrumb';
import CardRoot from '@/components/atoms/Card';
import { connectPrinter, disconnectPrinter } from '@/redux/reducers/printer';
import ReceiptPrinterEncoder from '@point-of-sale/receipt-printer-encoder';
import { printData } from '@/redux/reducers/printer';
import useDeviceInfo from '@/feature-flags/useDeviceInfo';

const PrinterPage = () => {
  const dispatch = useAppDispatch();
  const { message } = App.useApp();
  const { isConnected, device, error } = useAppSelector(({ printer }) => printer);
  const { isDesktop, browserName } = useDeviceInfo();

  const handleConnect = () => {
    dispatch(connectPrinter());
  };

  const handleDisconnect = () => {
    dispatch(disconnectPrinter());
  };

  const handlePrint = async () => {
    if (!isConnected) {
      message.warning('La impresora no está conectada.');
      return;
    }

    try {
      const encoder = new ReceiptPrinterEncoder({
        language: 'esc-pos',
        width: 32,
        // Agrega otras opciones si es necesario
      });

      const data = encoder
        .initialize()
        .codepage('auto')
        .newline()
        .align('center')
        .text('Ticket de Prueba')
        .newline()
        .align('left')
        .text('Este es un ticket de prueba')
        .newline()
        .newline()
        .newline()
        .cut()
        .encode();

      dispatch(printData(data));
    } catch (error) {
      message.error('Error al imprimir: ' + error);
    }
  };

  return (
    <div className="p-4 max-w-[730px] w-full mx-auto">
      <BreadcrumbSettings items={[{ label: 'Impresora' }]} />

      <div className="flex flex-col mb-0 w-full">
        <Typography.Title level={4}>Configuración de la impresora</Typography.Title>
      </div>

      <CardRoot style={{ width: '100%' }} title="Impresora">
        {isDesktop && browserName === 'Chrome' ? (
          <div>
            {/* <Avatar
            icon={<PrinterOutlined className="text-xl text-primary" />}
            className="w-12 min-w-12 h-12 bg-primary/10 border border-primary mb-2"
          /> */}
            <div className="flex flex-col gap-2 mb-5">
              <span>Estado de conexión:</span>

              <Alert
                showIcon
                className="w-fit"
                type={isConnected && !error && device ? 'success' : 'error'}
                message={isConnected && !error && device ? `Conectado a ${device?.name}` : 'Desconectado'}
              />
            </div>
            {error && (
              <div className="flex flex-col gap-2 mb-10">
                <span>Errores:</span>

                <Alert showIcon type={'error'} message={error} />
              </div>
            )}
            <div className="flex gap-5">
              {(isConnected || error) && device?.id ? (
                <>
                  <Button danger size="large" onClick={handleDisconnect}>
                    {error ? 'Eliminar conexión' : 'Desconectar Impresora'}
                  </Button>
                  {device?.id && !error && (
                    <Button size="large" onClick={handlePrint}>
                      Imprimir Ticket de Prueba
                    </Button>
                  )}
                </>
              ) : (
                <Button size="large" onClick={handleConnect}>
                  Conectar Impresora
                </Button>
              )}
            </div>
          </div>
        ) : (
          <Alert
            showIcon
            className="w-fit"
            type={'warning'}
            message="Esta funcionalidad solo está disponible en Google Chrome en computadoras de escritorio."
          />
        )}
      </CardRoot>
    </div>
  );
};

export default PrinterPage;
