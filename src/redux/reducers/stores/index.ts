import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CompanyStore, StoresSlice } from './types';
import { customStoreActions } from './actions';

const initialState: StoresSlice = {
  store: null,
  loading: false,
};

const stores = createSlice({
  name: 'stores',
  initialState,
  reducers: {
    resetSlice: () => initialState,
    setLoading: (state, payload: PayloadAction<boolean>) => {
      state.loading = payload.payload;
    },
    setStore: (state, payload: PayloadAction<Partial<CompanyStore>>) => {
      state.store = { ...state.store, ...payload.payload };
    },
  },
});

export const storesActions = { ...stores.actions, ...customStoreActions };

export default stores.reducer;
