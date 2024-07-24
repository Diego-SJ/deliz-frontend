import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { persistStore } from 'redux-persist';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store } from './redux/store';
import App from '@/components/app/App';
const persistor = persistStore(store);

const WithRouter = () => (
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

const WithStore = () => (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <WithRouter />
    </PersistGate>
  </Provider>
);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <WithStore />
  </React.StrictMode>,
);
