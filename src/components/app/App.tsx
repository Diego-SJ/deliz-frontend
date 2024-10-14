import { ONBOARDING_STEPS } from '@/constants/onboarding';
import { ROLES } from '@/constants/roles';
import { STATUS_DATA } from '@/constants/status';
import { useAppDispatch, useAppSelector } from '@/hooks/useStore';
import { appActions } from '@/redux/reducers/app';
import { userActions } from '@/redux/reducers/users';
import AppRouter from '@/routes/Router';
import AppThemeProvider from '@/styles/theme';
import { useEffect, useRef } from 'react';
import { useNetworkState } from '@uidotdev/usehooks';
import NewVersionModal from '../organisms/new-version-modal';

function App() {
  const dispatch = useAppDispatch();
  const network = useNetworkState();
  const { onboarding } = useAppSelector(({ app }) => app);
  const { authenticated, profile } = useAppSelector(
    ({ users }) => users?.user_auth,
  );
  const firstRender = useRef(false);

  useEffect(() => {
    if (!firstRender.current && authenticated && !!profile?.profile_id) {
      firstRender.current = true;
      (async () => {
        await dispatch(userActions.fetchProfile(profile?.profile_id!));

        if (
          !!profile?.role &&
          onboarding?.status_id === STATUS_DATA.COMPLETED.id
        ) {
          dispatch(userActions.fetchAppData());
        }

        if (
          profile?.role === ROLES.ONBOARDING_PENDING &&
          onboarding.step <= ONBOARDING_STEPS.FOUR
        ) {
          dispatch(appActions.fetchOnboarding());
          dispatch(appActions.company.getCompany());
        }
      })();
    }
  }, []);

  return (
    <AppThemeProvider>
      {!network?.online && authenticated && (
        <div className="fixed top-0 left-0 z-[999999999] w-full bg-red-500 text-white text-center py-2">
          Sin conexión a internet
        </div>
      )}
      <AppRouter />
      {authenticated && <NewVersionModal />}
    </AppThemeProvider>
  );
}

export default App;
