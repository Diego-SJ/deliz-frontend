import { useAppDispatch, useAppSelector } from '@/hooks/useStore';
import { cashiersActions } from '@/redux/reducers/cashiers';
import { Button, Form, Input, InputNumber, Modal } from 'antd';
import { useState } from 'react';

type Props = {
  visible: boolean;
  onClose: () => void;
};

const OpenCashierModal = ({ visible, onClose }: Props) => {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const { currentCashRegister } = useAppSelector(({ branches }) => branches);

  const handleOnClocks = () => {
    if (onClose) onClose();
    form.resetFields();
  };

  const onFinish = async () => {
    form.validateFields().then(async values => {
      setLoading(true);
      let success = await dispatch(cashiersActions.cash_cuts.openCashier(values));
      setLoading(false);
      if (success) {
        handleOnClocks();
      }
    });
  };

  return (
    <Modal width={400} title={`Abrir Caja ${currentCashRegister?.name}`} open={visible} onCancel={handleOnClocks} footer={null}>
      <Form requiredMark={false} form={form} layout="vertical" initialValues={{ notes: '', initial_amount: 0 }}>
        <Form.Item name="initial_amount" label="Monto inicial" rules={[{ required: true, message: 'Campo obligatorio' }]}>
          <InputNumber
            size="large"
            placeholder="$0.00"
            style={{ width: '100%' }}
            min={0}
            type="number"
            inputMode="decimal"
            onFocus={({ target }) => target.select()}
            onPressEnter={onFinish}
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
  );
};

export default OpenCashierModal;
