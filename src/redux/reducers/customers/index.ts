import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { Customer, CustomersSlice } from './types';
import customActions from './actions';

const initialState: CustomersSlice = {
  customers: [],
  current_customer: {} as Customer,
  loading: false,
};

const customers = createSlice({
  name: 'customers',
  initialState,
  reducers: {
    resetSlice: () => initialState,
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setCustomers(state, action: PayloadAction<Customer[]>) {
      state.customers = action.payload;
    },
    setCurrentCustomer(state, action: PayloadAction<Customer>) {
      state.current_customer = action.payload;
    },
  },
});

export const customerActions = { ...customers.actions, ...customActions };

export default customers.reducer;
