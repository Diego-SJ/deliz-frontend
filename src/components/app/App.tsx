import { useAppDispatch, useAppSelector } from '@/hooks/useStore';
import { productActions } from '@/redux/reducers/products';
import AppRouter from '@/routes/Router';
import AppThemeProvider from '@/styles/theme';
import { useEffect, useRef } from 'react';

function App() {
  const dispatch = useAppDispatch();
  const { categories } = useAppSelector(({ products }) => products);
  const firstRender = useRef(false);

  useEffect(() => {
    if (!firstRender.current) {
      firstRender.current = true;
      dispatch(productActions.fetchCategories({ refetch: true }));
    }
  }, [categories, dispatch]);

  return (
    <AppThemeProvider>
      <AppRouter />
    </AppThemeProvider>
  );
}

export default App;
