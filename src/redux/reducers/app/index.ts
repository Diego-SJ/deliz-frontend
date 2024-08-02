import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { AppSlice, Company } from './types';
import customActions from './actions';

const initialState: AppSlice = {
  company: {
    company_id: '',
    name: '',
    logo_url: '',
    phone: '',
    email: '',
    address: '',
    theme: '',
    created_at: '',
  },
  navigation: {
    menu: {
      activeItem: '',
      activeTitle: '',
    },
  },
};

const app = createSlice({
  name: 'app',
  initialState,
  reducers: {
    resetSlice: () => initialState,
    setCompany: (state, action: PayloadAction<Partial<Company>>) => {
      state.company = { ...state.company, ...action.payload };
    },
    setNavigation: (state, action: PayloadAction<Partial<AppSlice['navigation']>>) => {
      state.navigation = { ...state.navigation, ...action.payload };
    },
  },
});

export const appActions = { ...app.actions, ...customActions };

export default app.reducer;
