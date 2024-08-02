import { useAppDispatch, useAppSelector } from '@/hooks/useStore';
import { cashiersActions } from '@/redux/reducers/cashiers';
import { Button, Empty, Form, Input, InputNumber, Modal } from 'antd';
import { useState } from 'react';

const OpenCashierModal = () => {
  const [form] = Form.useForm();

  const dispatch = useAppDispatch();
  const { currentCashRegister } = useAppSelector(({ branches }) => branches);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const onClose = () => {
    setVisible(false);
    form.resetFields();
  };

  const onFinish = async () => {
    form.validateFields().then(async values => {
      setLoading(true);
      let success = await dispatch(cashiersActions.cash_cuts.openCashier(values));
      setLoading(false);
      if (success) {
        form.resetFields();
        onClose();
      }
    });
  };

  return (
    <div className="min-h-60 flex justify-center items-center">
      <Empty description="Aún no tienes una caja abierta">
        <Button onClick={() => setVisible(true)} loading={loading}>
          Abrir Caja {currentCashRegister?.name}
        </Button>
      </Empty>
      <Modal width={400} title={`Abrir Caja ${currentCashRegister?.name}`} open={visible} onCancel={onClose} footer={null}>
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
            <Input.TextArea rows={2} size="large" placeholder="Caja 1" />
          </Form.Item>
          <Button size="large" type="primary" onClick={onFinish} block loading={loading}>
            Abrir caja
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default OpenCashierModal;
