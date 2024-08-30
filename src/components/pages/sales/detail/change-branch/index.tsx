import { supabase } from '@/config/supabase';
import useMediaQuery from '@/hooks/useMediaQueries';
import { useAppDispatch, useAppSelector } from '@/hooks/useStore';
import { branchesActions } from '@/redux/reducers/branches';
import { cashiersActions } from '@/redux/reducers/cashiers';
import { CashCut } from '@/redux/reducers/cashiers/types';
import functions from '@/utils/functions';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { App, Button, Drawer, Form, Select, Typography } from 'antd';
import { useState } from 'react';

type Props = {
  open: boolean;
  onClose: () => void;
  saleId: number | null;
  cashCutId: string | null;
  currentBranchId?: string | null;
  currentCashRegisterId?: string | null;
};

const ChangeBranchDrawer = ({ open, onClose, saleId = null, cashCutId = null }: Props) => {
  const dispatch = useAppDispatch();
  const { isTablet } = useMediaQuery();
  const { branches, cash_registers } = useAppSelector(({ branches }) => branches);
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null);
  const [cashCuts, setCashCuts] = useState<CashCut[]>([]);
  const [step, setStep] = useState<'search' | 'save'>('search');
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const { message } = App.useApp();

  const handleOnClose = () => {
    onClose();
    form.resetFields();
    setSelectedBranch(null);
    setCashCuts([]);
    setStep('search');
  };

  const onFinish = () => {
    form.validateFields().then(async values => {
      setLoading(true);
      const { data, error } = await supabase
        .from('cash_cuts')
        .select('*')
        .eq('branch_id', values.branch_id)
        .eq('cash_register_id', values.cash_register_id)
        .order('opening_date', { ascending: false })
        .limit(5);

      if (error) {
        message.error('Ocurrió un error al consultar los cortes de caja');
        return;
      }

      if (!data?.length) {
        message.warning('No se encontraron cortes de caja para la sucursal seleccionada');
        setLoading(false);
        return;
      }

      setCashCuts(data);
      setStep('save');
      setLoading(false);
    });
  };

  const newSearch = () => {
    setStep('search');
    form.resetFields();
    setSelectedBranch(null);
  };

  const handleSaveNewBranch = async (newcCashCutId: string) => {
    setLoading(true);
    const success = await dispatch(
      cashiersActions.cash_cuts.moveSaleToAnotherCashCut({
        sale_id: saleId!,
        new_cash_cut_id: newcCashCutId,
        old_cash_cut_id: cashCutId!,
        branch_id: selectedBranch!,
        cash_register_id: form.getFieldValue('cash_register_id'),
      }),
    );
    setLoading(false);

    if (!success) {
      message.error('Ocurrió un error al cambiar la sucursal');
    } else {
      message.success('Se cambió la sucursal correctamente');
      handleOnClose();
    }
  };

  return (
    <Drawer
      height={'95dvh'}
      title="Cambiar sucursal"
      placement={isTablet ? 'bottom' : 'right'}
      onClose={handleOnClose}
      open={open}
      width={400}
    >
      {step === 'save' && (
        <Button icon={<ArrowLeftOutlined />} onClick={newSearch} className="!mb-5" size="large">
          Nueva busqueda
        </Button>
      )}
      {step === 'search' && (
        <Form form={form} requiredMark={false} layout="vertical" onFinish={onFinish}>
          <Form.Item label="Sucursal" name="branch_id" rules={[{ required: true, message: 'Seleccione una sucursal' }]}>
            <Select
              size="large"
              placeholder="Seleccione una sucursal"
              options={branches.map(branch => ({ label: branch.name, value: branch.branch_id }))}
              onClick={() => {
                if (!branches?.length) dispatch(branchesActions.getBranches());
              }}
              onChange={value => setSelectedBranch(value)}
            />
          </Form.Item>

          <Form.Item label="Caja " name="cash_register_id" rules={[{ required: true, message: 'Seleccione una caja' }]}>
            <Select
              size="large"
              placeholder="Seleccione una caja"
              options={cash_registers
                ?.filter(cr => selectedBranch === cr?.branch_id)
                .map(cash_register => ({ label: cash_register.name, value: cash_register.cash_register_id }))}
              onClick={() => {
                if (!cash_registers?.length) dispatch(branchesActions.getCashRegistersByCompanyId());
              }}
            />
          </Form.Item>
          <Form.Item className="mt-10">
            <Button type="primary" htmlType="submit" block size="large" loading={loading}>
              Consultar cortes de caja
            </Button>
          </Form.Item>
        </Form>
      )}

      {step === 'save' ? (
        <>
          <Typography.Title level={5}>Últimos cortes de caja</Typography.Title>
          <Typography.Paragraph type="secondary">
            Se muestran los últimos {cashCuts?.length < 5 ? cashCuts?.length : 5} cortes de caja
          </Typography.Paragraph>
          <ul>
            {cashCuts.map((cashCut: CashCut) => (
              <li key={cashCut.cash_cut_id} className="w-full flex-col bg-white rounded-xl border py-3 px-5 mb-4">
                <div className="grid grid-cols-2 gap-5 w-full mb-1">
                  <div className="flex flex-col">
                    <p className="font-semibold">{functions.money(cashCut?.initial_amount)}</p>
                    <p>{functions.date(cashCut?.opening_date)}</p>
                    <span className="text-gray-400 text-xs">apertura</span>
                  </div>
                  <div className="flex flex-col">
                    <p className="font-semibold"> {functions.money(cashCut?.final_amount || 0)}</p>
                    {cashCut?.closing_date ? (
                      <p>{functions.date(cashCut?.closing_date)}</p>
                    ) : (
                      <p className="text-green-600">En curso</p>
                    )}
                    <span className="text-gray-400 text-xs">cierre</span>
                  </div>
                </div>
                <div className="flex gap-5 w-full justify-between">
                  <div className="flex flex-col"></div>
                  <Button
                    type="primary"
                    size="small"
                    onClick={() => handleSaveNewBranch(cashCut?.cash_cut_id!)}
                    loading={loading}
                  >
                    Cambiar
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </>
      ) : null}
    </Drawer>
  );
};

export default ChangeBranchDrawer;
