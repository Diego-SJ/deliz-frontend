import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CompanyStore, StoresSlice } from './types';
import { customStoreActions } from './actions';

const initialState: StoresSlice = {
  store: {
    is_active: false,
    status_id: null,
    schedule: {
      friday: { closed: true, from: '', to: '' },
      monday: { closed: true, from: '', to: '' },
      sunday: { closed: true, from: '', to: '' },
      thursday: { closed: true, from: '', to: '' },
      tuesday: { closed: true, from: '', to: '' },
      saturday: { closed: true, from: '', to: '' },
      wednesday: { closed: true, from: '', to: '' },
    },
  },
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
