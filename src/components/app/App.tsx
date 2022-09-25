import AppRouter from '@/routes/Router';
import AppThemeProvider from '@/styles/theme';

function App() {
  return (
    <AppThemeProvider>
      <AppRouter />
    </AppThemeProvider>
  );
}

export default App;
