import OnlineStoreWeb from '@/assets/webp/store-example.webp';
import { STATUS_DATA } from '@/constants/status';
import { useAppDispatch, useAppSelector } from '@/hooks/useStore';
import { storesActions } from '@/redux/reducers/stores';
import { Button } from 'antd';

const ActivateStore = () => {
  const dispatch = useAppDispatch();
  const { loading, store } = useAppSelector(({ stores }) => stores);
  const { company } = useAppSelector(({ app }) => app);

  const activeStore = () => {
    let companySlug = company?.name?.toLowerCase()?.trim().replace(/ /g, '-');
    dispatch(
      storesActions.updateStore({
        is_active: true,
        status_id: STATUS_DATA.ACTIVE.id,
        slug: companySlug,
        store_id: store?.store_id || null,
      }),
    );
  };

  return (
    <div className="p-5">
      <div className="w-full max-w-[700px] bg-white rounded-xl shadow-xl overflow-hidden">
        <div className="w-full h-56 sm:h-80 overflow-hidden">
          <img src={OnlineStoreWeb} alt="online store" className="w-full !aspect-auto" />
        </div>
        <div className="h-[1px] w-full bg-gray-200"></div>
        <div className="p-4 flex flex-col pt-3 pb-7">
          <h1 className="text-3xl font-semibold text-center mb-3">¡Activa tu tienda en línea!</h1>
          <ul className="list-none font-light text-center text-gray-400 mb-5">
            <li>💵 Brinda a tus clientes un catálogo de tus productos para verte más profesional.</li>
            <li>🎯 Tú decides que productos mostrar.</li>
            <li>📝 Recibe pedidos a tráves de WhatsApp</li>
            <li>🖥️ Tendrás tu propia landing page de tu negocio.</li>
            <li>🎉 ¡Y muchas funciones más! </li>
          </ul>

          <Button type="primary" className="mx-auto " size="large" loading={loading} onClick={activeStore}>
            {loading ? 'Activando...' : store?.status_id !== STATUS_DATA.ACTIVE.id ? 'Activar de nuevo' : '¡Activar ahora!'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ActivateStore;
