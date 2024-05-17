import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import customActions from './actions';
import { CashOperation, CashOperations, CashierDetail, CashiersSlice } from './types';
import { Cashier } from '../sales/types';
import { set } from 'date-fns';

const initialState: CashiersSlice = {
  cash_operations: {
    data: [],
    sales_by_cashier: [],
    initial_amount: 0,
    sales_amount: 0,
    incomes_amount: 0,
    expenses_amount: 0,
    total_amount: 0,
    selected: {} as CashOperation,
    operations: [],
  },
  cashier_detail: {
    data: {} as Cashier,
    operations: [],
  },
  error: null,
  loading: false,
};

const cashiers = createSlice({
  name: 'cashiers',
  initialState,
  reducers: {
    resetSlice: () => initialState,
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setCashOperations(state, action: PayloadAction<CashOperations>) {
      state.cash_operations = { ...state.cash_operations, ...action.payload };
    },
    setCashierDetail(state, action: PayloadAction<CashierDetail>) {
      state.cashier_detail = { ...state.cashier_detail, ...action.payload };
    },
  },
});

export const cashiersActions = { ...cashiers.actions, ...customActions };

export default cashiers.reducer;
