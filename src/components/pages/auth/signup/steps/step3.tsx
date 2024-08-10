import { App, Avatar, Button, Typography } from 'antd';
import { FlagOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '@/hooks/useStore';
import { appActions } from '@/redux/reducers/app';
import { useState } from 'react';

const FEATURES = [
  { label: 'Punto de venta', value: 'pos' },
  { label: 'Inventario', value: 'inventory' },
  { label: 'Reportes', value: 'reports' },
  { label: 'Gestión de clientes', value: 'customers_management' },
  { label: 'Gestión de ventas', value: 'sales_management' },
  { label: 'Administración de gastos', value: 'expenses_management' },
  { label: 'Multiples sucursales', value: 'multiple_branches' },
  { label: 'Multiples cajas', value: 'multiple_cash_registers' },
  { label: 'Catalogo digital', value: 'digital_catalog' },
  { label: 'Permisos y usuarios', value: 'users_management' },
];

const StepThree = () => {
  const dispatch = useAppDispatch();
  const { message } = App.useApp();
  const { loading } = useAppSelector(({ app }) => app);
  const { step = 1, ...onboardingValues } = useAppSelector(({ app }) => app.onboarding);
  const [importantFeatures, setImportantFeatures] = useState<string[]>(onboardingValues?.important_features ?? []);

  const handlePreviousStep = () => {
    dispatch(appActions.setOnboarding({ step: step - 1 }));
  };

  const handleOnFinish = async () => {
    if (importantFeatures.length === 0) {
      message.info('Selecciona al menos una funcionalidad');
      return;
    }
    await dispatch(appActions.updateOnboarding({ step: step + 1, important_features: importantFeatures }));
  };

  const handleFeatureSelection = (value: string) => {
    setImportantFeatures(prev => {
      if (prev.includes(value)) {
        return prev.filter(item => item !== value);
      }

      return [...prev, value];
    });
  };

  return (
    <>
      <div className="flex flex-col items-center  px-6 min-h-[calc(100dvh-135px)] max-h-[calc(100dvh-135px)] overflow-y-scroll py-8">
        <Avatar
          icon={<FlagOutlined className="text-primary text-3xl" />}
          shape="square"
          className="bg-primary/10 !rounded-2xl min-h-14 w-14"
        />
        <Typography.Title level={3} className="!mb-1 !mt-2">
          ¡Paso final!
        </Typography.Title>
        <Typography.Text type="secondary" className="mb-5 md:mb-10 text-center">
          Cuentanos que funcionalidades son más importantes para tu negocio
        </Typography.Text>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {FEATURES.map(({ label, value }) => (
            <div
              className={`w-full border flex justify-center items-center text-center  cursor-pointer h-20 shadow-lg rounded-xl  p-4 ${
                importantFeatures.includes(value)
                  ? 'bg-primary/10 !text-primary border-primary'
                  : 'bg-white border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleFeatureSelection(value)}
            >
              <span className="!text-current">{label}</span>
            </div>
          ))}
        </div>
      </div>

      <footer className="h-[70px] flex justify-center items-center px-6 mt-auto border-t">
        <div className="max-w-[700px] mx-auto flex w-full justify-between gap-6">
          {step > 1 ? (
            <Button size="large" type="default" className="w-full max-w-40" onClick={handlePreviousStep} loading={loading}>
              Anterior
            </Button>
          ) : (
            <span />
          )}
          {step <= 3 && (
            <Button size="large" type="primary" className="w-full max-w-40" onClick={handleOnFinish} loading={loading}>
              {step === 3 ? 'Finalizar' : 'Siguiente'}
            </Button>
          )}
        </div>
      </footer>
    </>
  );
};

export default StepThree;
