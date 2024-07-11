import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { AppSlice, Business } from './types';
import customActions from './actions';

const initialState: AppSlice = {
  business: {
    business_id: '',
    name: '',
    logo_url: '',
    phone: '',
    email: '',
    address: '',
    theme: '',
    created_at: '',
  },
};

const app = createSlice({
  name: 'app',
  initialState,
  reducers: {
    resetAppSlice: () => initialState,
    setBusiness: (state, action: PayloadAction<Partial<Business>>) => {
      state.business = { ...state.business, ...action.payload };
    },
  },
});

export const appActions = { ...app.actions, ...customActions };

export default app.reducer;
