import { useAppDispatch, useAppSelector } from '@/hooks/useStore';
import { appActions } from '@/redux/reducers/app';
import { theme } from '@/styles/theme/config';
import { Typography } from 'antd';
import { useEffectOnce } from 'react-use';
import Joyride, { CallBackProps, STATUS } from 'react-joyride';
import { Step } from 'react-joyride';
import { useEffect } from 'react';
import useMediaQuery from '@/hooks/useMediaQueries';

const allySteps = ({ title, content, target, ...props }: Step) => {
  return {
    ...props,
    title: <span className="text-xl font-semibold">{title}</span>,
    content: (
      <Typography.Paragraph type="secondary" className="!text-base">
        {content}
      </Typography.Paragraph>
    ),
    locale: {
      skip: 'Omitir tutorial',
      back: 'Atrás',
      next: 'Siguiente',
      last: 'Finalizar',
    },
    target,
  };
};

const OnboardingTour = () => {
  const dispatch = useAppDispatch();
  const { tour } = useAppSelector(({ app }) => app);
  const { isPhablet } = useMediaQuery();
  const { profile, isAdmin } = useAppSelector(({ users }) => users?.user_auth);

  useEffect(() => {
    if (isAdmin && !isPhablet) {
      dispatch(appActions.setTourState({ run: !profile?.tours?.dashboard }));
    }
  }, [profile?.tours?.dashboard, isPhablet]);

  const handleCallback = (data: CallBackProps) => {
    const { status, step } = data;
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

    if (finishedStatuses.includes(status)) {
      dispatch(appActions.tours.finishTour());
    }
  };

  return (
    <>
      <Joyride
        callback={handleCallback}
        continuous
        run={!!tour?.run && !isPhablet}
        scrollToFirstStep
        showProgress
        disableCloseOnEsc
        disableOverlayClose
        hideCloseButton
        showSkipButton
        steps={[
          allySteps({
            title: '¡Bienvenido a tu panel de control!',
            content:
              'Desde aquí podrás gestionar ventas, productos, clientes y más.',
            target: 'body',
            placement: 'center',
          }),
          allySteps({
            title: 'Accesos rápidos',
            content:
              'Accede rápidamente a las secciones más importantes de tu negocio.',
            target: '.step-1',
            spotlightPadding: 0,
          }),
          allySteps({
            title: 'Botón de “Nueva venta”',
            content:
              'Comienza una nueva venta rápida accediendo al punto de venta. Ideal para ventas al público en mostrador.',
            target: '.step-new_sale_btn',
          }),
          allySteps({
            title: 'Productos',
            content:
              'Administra tus productos, crea, edita y elimina productos.',
            target: '.step-products',
          }),
          allySteps({
            title: 'Clientes',
            content:
              'Registra clientes para llevar un control de ventas y recompensas personalizadas.',
            target: '.step-customers',
          }),
          allySteps({
            title: 'Ventas',
            content:
              'Accede al historial completo de ventas. Filtra y consulta los detalles de cada transacción.',
            target: '.step-sales',
          }),
          allySteps({
            title: 'Cajas',
            content:
              'Gestiona tu caja actual o revisa el historial de movimientos para tener un control preciso del efectivo.',
            target: '.step-cashiers',
          }),
          allySteps({
            title: 'Gastos',
            content:
              'Registra y consulta gastos del negocio para tomar decisiones informadas sobre tus finanzas.',
            target: '.step-expenses',
          }),
          allySteps({
            title: 'Reportes',
            content:
              'Genera reportes detallados de ventas, productos más vendidos y más información útil para analizar el rendimiento de tu negocio.',
            target: '.step-reports',
          }),
          allySteps({
            title: 'Catálogo en Línea',
            content:
              '¿Quieres vender en línea? Aquí puedes gestionar tu catálogo en línea para llevar tus productos al mundo digital.',
            target: '.step-online_catalog',
          }),
          allySteps({
            title: 'Configuración',
            content:
              'Personaliza las opciones de tu negocio, configura tu sucursal y gestiona permisos de usuarios.',
            target: '.step-settings',
          }),
          allySteps({
            title: '¡Eso es todo!!',
            content:
              'Ahora estás listo para gestionar tu negocio de manera eficiente. ¿Listo para empezar?',
            target: 'body',
            placement: 'center',
          }),
        ]}
        styles={{
          options: {
            // arrowColor: theme.black,
            // backgroundColor: theme.black,
            primaryColor: theme.colors.primary,
            // textColor: theme.white,
          },
        }}
      />
    </>
  );
};

export default OnboardingTour;
