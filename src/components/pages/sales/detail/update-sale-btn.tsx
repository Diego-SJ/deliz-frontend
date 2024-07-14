import NumberKeyboard from '@/components/atoms/NumberKeyboard';
import useMediaQuery from '@/hooks/useMediaQueries';
import { useAppDispatch, useAppSelector } from '@/hooks/useStore';
import { salesActions } from '@/redux/reducers/sales';
import { Sale } from '@/redux/reducers/sales/types';
import functions from '@/utils/functions';
import { DollarOutlined } from '@ant-design/icons';
import { Button, Col, InputNumber, Modal, Radio, Row, Typography } from 'antd';
import { FC, useRef, useState } from 'react';
import { Amounts } from './index';

type UpdateSaleButton = {
  amounts: Amounts;
};

const { Title, Paragraph } = Typography;

const UpdateSaleButton: FC<UpdateSaleButton> = ({ amounts }) => {
  const dispatch = useAppDispatch();
  const { current_sale } = useAppSelector(({ sales }) => sales);

  const [saleStatus, setSaleStatus] = useState<number>(5); // 4 paid, 5 pending, 6 cancelled
  const [receivedMoney, setReceivedMoney] = useState(0);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const { isTablet } = useMediaQuery();
  const { total = 0, amount_paid, pending } = amounts;
  const cashback = pending - receivedMoney;
  const priceRef = useRef<HTMLInputElement | null>(null);

  const handleOk = async () => {
    setLoading(true);

    const newSale: Sale = {
      status_id: saleStatus,
      amount_paid: receivedMoney + amount_paid >= total ? total : receivedMoney + amount_paid,
      sale_id: current_sale?.metadata?.sale_id,
      cashback: cashback >= 0 ? 0 : Math.abs(cashback),
    };
    const success = await dispatch(salesActions.upsertSale(newSale));

    if (success) {
      setReceivedMoney(0);
      closeModal();
    }
    setLoading(false);
  };

  const openModal = () => {
    setOpen(true);
    setSaleStatus(current_sale.metadata?.status_id as number);
    setTimeout(() => {
      priceRef.current?.focus();
      priceRef.current?.select();
    }, 300);
  };

  const onAmountChange = (value: number) => {
    setSaleStatus(value >= pending ? 4 : 5);
    setReceivedMoney(value);
  };

  const onStatusChange = (status: number) => {
    setSaleStatus(status);
  };

  const closeModal = () => {
    setOpen(false);
    setReceivedMoney(0);
  };

  return (
    <>
      <Button type="primary" icon={<DollarOutlined />} block onClick={openModal}>
        Registrar Cobro
      </Button>

      <Modal
        open={open}
        onCancel={closeModal}
        maskClosable={false}
        destroyOnClose
        width={380}
        footer={[
          <Row key="actions" gutter={10} style={{ marginTop: 30 }}>
            <Col span={12}>
              <Button key="back" block onClick={closeModal} loading={loading}>
                Cancelar
              </Button>
            </Col>
            <Col span={12}>
              <Button block type="primary" onClick={handleOk} disabled={receivedMoney < 0} loading={loading}>
                Actualizar
              </Button>
            </Col>
          </Row>,
        ]}
      >
        <Title level={2} style={{ margin: 0 }}>{`Total: ${functions.money(total)}`}</Title>
        <Title level={4} style={{ margin: 0 }}>{`Abono: ${functions.money(amount_paid)}`}</Title>
        <Title level={4} type={receivedMoney >= pending ? 'success' : 'danger'} style={{ margin: 0 }}>
          {`Pendiente: ${functions.money(pending - receivedMoney <= 0 ? 0 : pending - receivedMoney)}`}
        </Title>
        <Title level={4} type="warning" style={{ margin: 0 }}>
          {`Cambio: ${functions.money(cashback >= 0 ? 0 : Math.abs(cashback))}`}
        </Title>
        <Paragraph style={{ margin: '10px 0 5px', fontWeight: 600 }}>Estatus:</Paragraph>
        <Radio.Group
          style={{ width: '100%', marginBottom: 10 }}
          buttonStyle="solid"
          value={saleStatus}
          onChange={({ target }) => setSaleStatus(target.value)}
        >
          <Radio.Button style={{ width: '33.33%' }} value={4}>
            Pagado
          </Radio.Button>
          <Radio.Button style={{ width: '33.33%' }} value={5}>
            Pendiente
          </Radio.Button>
          <Radio.Button style={{ width: '33.33%' }} value={6}>
            Cancelada
          </Radio.Button>
        </Radio.Group>
        <Paragraph style={{ margin: '0 0 5px', fontWeight: 600 }}>Cantidad recibida:</Paragraph>
        <InputNumber
          ref={priceRef}
          min={0}
          placeholder="0"
          addonBefore="$"
          value={receivedMoney}
          style={{ width: '100%', margin: '0' }}
          onChange={value => onAmountChange(value || 0)}
        />
        {isTablet && <NumberKeyboard value={receivedMoney} withDot onChange={value => onAmountChange(value || 0)} />}
      </Modal>
    </>
  );
};

export default UpdateSaleButton;
