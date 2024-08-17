import { useAppDispatch, useAppSelector } from '@/hooks/useStore';
import ActivateStore from './activate-store';
import { useEffect, useRef } from 'react';
import { storesActions } from '@/redux/reducers/stores';
import { STATUS_DATA } from '@/constants/status';
import StoreForm from './store-form';

const OnlineStorePage = () => {
  const dispatch = useAppDispatch();
  const { store } = useAppSelector(({ stores }) => stores);
  const mounted = useRef(false);

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      dispatch(storesActions.getStore());
    }
  }, [mounted, dispatch]);

  return (
    <div className="w-full flex flex-col items-center relative min-h-[calc(100dvh-64px)] max-h-[calc(100dvh-64px)]">
      {!store?.is_active || (store?.status_id !== STATUS_DATA.ACTIVE.id && <ActivateStore />)}
      {store?.status_id === STATUS_DATA.ACTIVE.id && <StoreForm />}
    </div>
  );
};

export default OnlineStorePage;
