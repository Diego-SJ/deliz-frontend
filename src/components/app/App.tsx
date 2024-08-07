import { useAppDispatch, useAppSelector } from '@/hooks/useStore';
import { productActions } from '@/redux/reducers/products';
import { userActions } from '@/redux/reducers/users';
import AppRouter from '@/routes/Router';
import AppThemeProvider from '@/styles/theme';
import { useEffect, useRef } from 'react';

function App() {
  const dispatch = useAppDispatch();
  const { categories } = useAppSelector(({ products }) => products);
  const { authenticated, profile } = useAppSelector(({ users }) => users?.user_auth);
  const firstRender = useRef(false);

  useEffect(() => {
    if (!firstRender.current && authenticated && !!profile?.profile_id) {
      firstRender.current = true;
      dispatch(productActions.fetchCategories({ refetch: true }));
      dispatch(userActions.fetchProfile(profile?.profile_id));
    }
  }, [categories, dispatch, authenticated, profile]);

  return (
    <AppThemeProvider>
      <AppRouter />
    </AppThemeProvider>
  );
}

export default App;
