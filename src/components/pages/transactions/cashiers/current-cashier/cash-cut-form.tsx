import useMediaQuery from '@/hooks/useMediaQueries';
import { useAppDispatch, useAppSelector } from '@/hooks/useStore';
import { cashiersActions } from '@/redux/reducers/cashiers';
import { salesActions } from '@/redux/reducers/sales';
import functions from '@/utils/functions';
import { App, Button, Col, Drawer, Form, InputNumber, Row, Tag, Typography } from 'antd';
import React, { useState } from 'react';

const CashCutForm = () => {
  const [closeDayForm] = Form.useForm();
  const dispatch = useAppDispatch();
  const [openCloseCashier, setOpenCloseCashier] = useState(false);
  const [loading, setLoading] = useState(false);
  const { isTablet } = useMediaQuery();
  const { active_cash_cut } = useAppSelector(({ cashiers }) => cashiers);
  const [receivedMoney, setReceivedMoney] = useState(0);

  const handleDrawerVisible = () => {
    setOpenCloseCashier(prev => !prev);
    closeDayForm.resetFields();
  };

  const closeCashier = () => {
    closeDayForm.validateFields().then(async ({ amount }) => {
      setLoading(true);
      await dispatch(cashiersActions.cash_cuts.makeCashCut(amount));
      handleDrawerVisible();
      setLoading(false);
    });
  };

  return (
    <>
      <Button className="w-full md:w-fit" size={isTablet ? 'large' : 'middle'} type="primary" onClick={handleDrawerVisible}>
        Hacer corte de caja
      </Button>

      {/* Close cashier */}
      <Drawer
        title="Cerrar caja"
        placement={isTablet ? 'bottom' : 'right'}
        onClose={handleDrawerVisible}
        height={'80dvh'}
        width={isTablet ? '100%' : '450px'}
        open={openCloseCashier}
        destroyOnClose
        footer={
          <Row gutter={[10, 10]}>
            <Col xs={12}>
              <Button size="large" type="default" block onClick={handleDrawerVisible} loading={loading}>
                Cancelar
              </Button>
            </Col>
            <Col xs={12}>
              <Button size="large" type="primary" block onClick={closeCashier} loading={loading}>
                Continuar
              </Button>
            </Col>
          </Row>
        }
      >
        <Form layout="vertical" onFinish={closeCashier} form={closeDayForm} initialValues={{}}>
          <div className="bg-gray-50 text-center rounded-lg px-5 py-6 mb-4">
            <Typography.Paragraph className="!m-0 text-lg font-normal text-gray-400">Total esperado</Typography.Paragraph>
            <Typography.Title level={2} className="!m-0 !font-extrabold !text-5xl">
              {functions.money(active_cash_cut?.final_amount || 0)}
            </Typography.Title>
            {receivedMoney < (active_cash_cut?.final_amount || 0) && (
              <Tag bordered={false} color="error" className="mt-3 px-3 py-1 text-base">
                Faltan {functions.money((active_cash_cut?.final_amount || 0) - receivedMoney)}
              </Tag>
            )}
            {receivedMoney > (active_cash_cut?.final_amount || 0) && (
              <Tag bordered={false} color="gold" className="mt-3 px-3 py-1 text-base">
                Sobran {functions.money(receivedMoney - (active_cash_cut?.final_amount || 0))}
              </Tag>
            )}
            {receivedMoney === (active_cash_cut?.final_amount || 0) && (
              <Tag bordered={false} color="success" className="mt-3 px-3 py-1 text-base">
                No hay diferencias
              </Tag>
            )}
          </div>
          <Form.Item name="amount" rules={[{ required: true, message: 'Campo obligatorio' }]}>
            <InputNumber
              prefix="$"
              size="large"
              inputMode="decimal"
              autoFocus
              value={receivedMoney}
              onFocus={({ target }) => target.select()}
              type="number"
              placeholder="0.00"
              style={{ width: '100%' }}
              onPressEnter={closeCashier}
              onChange={value => setReceivedMoney(value || 0)}
              className="text-center"
            />
          </Form.Item>
        </Form>
      </Drawer>
    </>
  );
};

export default CashCutForm;
