import { useAppDispatch, useAppSelector } from '@/hooks/useStore';
import { cashiersActions } from '@/redux/reducers/cashiers';
import { Button, Form, Input, InputNumber, Modal, Typography } from 'antd';
import { useState } from 'react';

const OpenCashCut = () => {
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();
  const { active_cash_cut } = useAppSelector(({ cashiers }) => cashiers);

  const { currentCashRegister } = useAppSelector(({ branches }) => branches);
  const [loading, setLoading] = useState(false);

  const onFinish = async () => {
    form.validateFields().then(async values => {
      setLoading(true);
      let success = await dispatch(cashiersActions.cash_cuts.openCashier(values));
      setLoading(false);
      if (success) {
        form.resetFields();
      }
    });
  };

  return (
    <Modal
      width={400}
      title={`Abrir Caja ${currentCashRegister?.name}`}
      open={!active_cash_cut?.is_open}
      footer={null}
      closeIcon={null}
    >
      <Typography.Paragraph className="text-slate-400">
        Abre una caja para comenzar a registrar tus ventas y movimientos de efectivo.
      </Typography.Paragraph>
      <Form form={form} layout="vertical" initialValues={{ notes: '', initial_amount: 0 }}>
        <Form.Item name="initial_amount" label="Monto inicial" rules={[{ required: true, message: 'Campo obligatorio' }]}>
          <InputNumber
            size="large"
            placeholder="$0.00"
            style={{ width: '100%' }}
            min={0}
            type="number"
            inputMode="decimal"
            onFocus={({ target }) => target.select()}
          />
        </Form.Item>
        <Form.Item name="notes" label="Comentarios">
          <Input.TextArea rows={2} size="large" placeholder="Opcional" />
        </Form.Item>
        <Button size="large" type="primary" onClick={onFinish} block loading={loading}>
          Abrir caja
        </Button>
      </Form>
    </Modal>
  );
};

export default OpenCashCut;
