import { ONBOARDING_STEPS } from '@/constants/onboarding';
import { ROLES } from '@/constants/roles';
import { STATUS_DATA } from '@/constants/status';
import { useAppDispatch, useAppSelector } from '@/hooks/useStore';
import { appActions } from '@/redux/reducers/app';
import { userActions } from '@/redux/reducers/users';
import AppRouter from '@/routes/Router';
import AppThemeProvider from '@/styles/theme';
import { useEffect, useRef } from 'react';

function App() {
  const dispatch = useAppDispatch();
  const { onboarding } = useAppSelector(({ app }) => app);
  const { authenticated, profile } = useAppSelector(({ users }) => users?.user_auth);
  const firstRender = useRef(false);

  useEffect(() => {
    if (!firstRender.current && authenticated && !!profile?.profile_id) {
      firstRender.current = true;

      if (!!profile?.role && onboarding?.status_id === STATUS_DATA.COMPLETED.id) {
        dispatch(userActions.fetchAppData());
      }

      if (profile?.role === ROLES.ONBOARDING_PENDING && onboarding.step <= ONBOARDING_STEPS.FOUR) {
        dispatch(appActions.fetchOnboarding());
        dispatch(appActions.company.getCompany());
      }
    }
  }, []);

  return (
    <AppThemeProvider>
      <AppRouter />
    </AppThemeProvider>
  );
}

export default App;
