import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import productsReducer from './reducers/products';
import customersReducer from './reducers/customers';
import salesReducer from './reducers/sales';
import usersReducer from './reducers/users';
import cashiersReducer from './reducers/cashiers';
import branchesReducer from './reducers/branches';
import appReducer from './reducers/app';

const rootReducer = combineReducers({
  app: appReducer,
  products: productsReducer,
  customers: customersReducer,
  sales: salesReducer,
  users: usersReducer,
  cashiers: cashiersReducer,
  branches: branchesReducer,
});

const persistConfig = { key: 'deliz.app', version: 1, storage };
const persistedReducer = persistReducer(persistConfig, rootReducer);
export type RootState = ReturnType<typeof rootReducer>;

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type AppDispatch = typeof store.dispatch;
export type AppState = () => RootState;
