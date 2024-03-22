import { STATUS_DATA } from '@/constants/status';
import useMediaQuery from '@/hooks/useMediaQueries';
import { useAppDispatch, useAppSelector } from '@/hooks/useStore';
import { salesActions } from '@/redux/reducers/sales';
import { Cashier } from '@/redux/reducers/sales/types';
import functions from '@/utils/functions';
import { DollarOutlined, FolderOpenOutlined, FolderOutlined } from '@ant-design/icons';
import { Avatar, Button, Card, Col, Drawer, Form, Input, InputNumber, Modal, Row } from 'antd';
import { useEffect, useRef, useState } from 'react';

type Props = {
  onSuccess?: (args: boolean) => void;
};

const OpenCashier = ({ onSuccess }: Props) => {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const { cashiers, loading, sales } = useAppSelector(({ sales }) => sales);
  const [totalSaleAmount, setTotalSaleAmount] = useState(0);
  const { isTablet } = useMediaQuery();
  const firtRender = useRef(false);

  useEffect(() => {
    if (!firtRender.current) {
      firtRender.current = true;
      dispatch(salesActions.cashiers.get({ refetch: true }));
    }
  }, [firtRender.current, dispatch]);

  useEffect(() => {
    if (!!cashiers?.activeCashier?.cashier_id) {
      dispatch(salesActions.fetchSales({ refetch: true }));
    }
  }, [dispatch, cashiers?.activeCashier]);

  useEffect(() => {
    let totalAmounts = sales
      ?.filter(i => i?.cashier_id === cashiers?.activeCashier?.cashier_id && i?.status_id === STATUS_DATA.COMPLETED.id)
      ?.reduce((acc, item) => {
        let _total = (item?.amount_paid || 0) - (item?.cashback || 0);
        return (item?.total || _total) + acc;
      }, 0);
    setTotalSaleAmount(totalAmounts);
  }, [sales, cashiers?.activeCashier?.cashier_id]);

  const onClose = () => {
    form.resetFields();
    dispatch(salesActions.setCashiers({ drawer: null }));
  };

  const onFinish = async (values: Cashier) => {
    let success = false;
    if (cashiers?.drawer === 'new') success = await dispatch(salesActions.cashiers.add(values));
    else if (cashiers?.drawer === 'edit') {
      success = await dispatch(salesActions.cashiers.update({ ...values, cashier_id: cashiers?.selected?.cashier_id }));
    }

    if (success) {
      form.resetFields();
      onClose();
      if (onSuccess) onSuccess(success);
    }
  };

  const addNewCashier = () => {
    dispatch(salesActions.setCashiers({ drawer: 'new' }));
  };

  const closeCashier = () => {
    Modal.confirm({
      onOk: () => {
        dispatch(salesActions.cashiers.closeDay());
      },
      title: `¿Desea cerrar la Caja: ${cashiers?.activeCashier?.name}?`,
      cancelText: 'Cancelar',
      okText: 'Confirmar',
    });
  };

  return (
    <Row>
      <Col xs={24}>
        {!!cashiers?.activeCashier ? (
          <>
            <Card hoverable onClick={closeCashier}>
              <Card.Meta
                avatar={<Avatar icon={<FolderOutlined rev={{}} />} style={{ background: '#ea4343' }} size={60} />}
                title={`Cerrar caja: ${cashiers?.activeCashier?.name}`}
                description="Da click para cerrar la caja"
              />
            </Card>
            <Row style={{ width: '100%', marginTop: 10 }} gutter={[10, 10]}>
              <Col xs={24} md={12} lg={8}>
                <Card style={{ width: '100%' }}>
                  <Card.Meta
                    avatar={<Avatar icon={<DollarOutlined rev={{}} />} style={{ background: '#2db7f5' }} size={60} />}
                    title={functions.money(cashiers?.activeCashier?.initial_amount)}
                    description="Saldo Inicial"
                  />
                </Card>
              </Col>
              <Col xs={24} md={12} lg={8}>
                <Card>
                  <Card.Meta
                    avatar={<Avatar icon={<DollarOutlined rev={{}} />} style={{ background: '#2db7f5' }} size={60} />}
                    title={functions.money(totalSaleAmount)}
                    description="Ventas"
                  />
                </Card>
              </Col>
              <Col xs={24} md={12} lg={8}>
                <Card>
                  <Card.Meta
                    avatar={<Avatar icon={<DollarOutlined rev={{}} />} style={{ background: '#2db7f5' }} size={60} />}
                    title={functions.money(totalSaleAmount + (cashiers?.activeCashier?.initial_amount || 0))}
                    description="Total a recibir"
                  />
                </Card>
              </Col>
            </Row>
          </>
        ) : (
          <Card hoverable onClick={addNewCashier}>
            <Card.Meta
              avatar={<Avatar icon={<FolderOpenOutlined rev={{}} />} style={{ background: '#87d068' }} size={60} />}
              title="Abrir caja"
              description="Registra las ventas del día iniciando una caja nueva"
            />
          </Card>
        )}
      </Col>

      <Drawer
        title={cashiers?.drawer === 'new' ? 'Abrir caja' : 'Editar caja'}
        width={isTablet ? 350 : 420}
        onClose={onClose}
        open={!!cashiers?.drawer}
        styles={{ body: { paddingBottom: 80 } }}
        destroyOnClose
        footer={
          <Button size="large" type="primary" block onClick={() => form.submit()} loading={loading}>
            Guardar
          </Button>
        }
      >
        <Form form={form} layout="vertical" onFinish={onFinish} initialValues={{ ...cashiers?.selected }}>
          <Form.Item name="initial_amount" label="Saldo inicial">
            <InputNumber size="large" placeholder="$0.00" style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="name" label="Nombre de la caja">
            <Input size="large" placeholder="Caja 1" />
          </Form.Item>
          {cashiers?.drawer === 'edit' && (
            <Form.Item name="received_amount" label="Saldo recibido en caja">
              <InputNumber size="large" placeholder="$0.00" style={{ width: '100%' }} />
            </Form.Item>
          )}
        </Form>
      </Drawer>
    </Row>
  );
};

export default OpenCashier;
