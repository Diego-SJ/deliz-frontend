// src/components/NewSale.tsx
import React, { useState } from 'react';
import { App, Button, Modal, Tag } from 'antd';
import { useAppDispatch, useAppSelector } from '@/hooks/useStore';
import { connectPrinter, disconnectPrinter, printData } from '@/redux/reducers/printer';
import { PrinterOutlined } from '@ant-design/icons';
import useMediaQuery from '@/hooks/useMediaQueries';
import ReceiptPrinterEncoder from '@point-of-sale/receipt-printer-encoder';

const PrinterButton: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isTablet } = useMediaQuery();
  const { message } = App.useApp();
  const { isConnected, device, error } = useAppSelector(({ printer }) => printer);
  const [openModal, setOpenModal] = useState(false);
  const printerIsDisconnected = !isConnected || !device || error;

  const recconectPrinter = () => {
    dispatch(disconnectPrinter());
    dispatch(connectPrinter());
  };

  const handleModal = () => {
    setOpenModal((prev) => !prev);
  };

  const printTest = () => {
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
    <div>
      {printerIsDisconnected ? (
        <Tag color="warning" onClick={recconectPrinter} icon={<PrinterOutlined />} className="cursor-pointer">
          {isTablet ? '' : 'Conectar impresora'}
        </Tag>
      ) : (
        <Tag color="success" icon={<PrinterOutlined />} onClick={handleModal} className="cursor-pointer">
          {`${device?.name}${isTablet ? '' : ' conectada'}`}
        </Tag>
      )}

      <Modal
        onCancel={handleModal}
        onClose={handleModal}
        onOk={handleModal}
        width={400}
        open={openModal}
        cancelButtonProps={{ hidden: true }}
        cancelText={false}
        title="Impresora"
      >
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-5">
          {device ? (
            <div>
              <p>Nombre: {device?.name}</p>
              <p>Conectada: {isConnected ? 'Sí' : 'No'}</p>
            </div>
          ) : null}
          <Button onClick={printTest}>Imprimir ticket de prueba</Button>
        </div>
      </Modal>
    </div>
  );
};

export default PrinterButton;
