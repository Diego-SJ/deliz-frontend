import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import customActions from './actions';
import { CashCut, CashCutFilters, CashOperation, CashOperations, CashierDetail, CashiersSlice } from './types';
import { Cashier } from '../sales/types';

const initialState: CashiersSlice = {
  active_cash_cut: null,
  cash_cuts: {
    data: [],
    filters: {
      cash_register_id: '',
      order_by: 'closing_date,false',
      page: 1,
      pageSize: 10,
      total: 0,
    },
  },
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
    setActiveCashCut(state, action: PayloadAction<CashCut | null>) {
      state.active_cash_cut = action.payload;
    },
    setCashCuts(state, action: PayloadAction<CashCut[]>) {
      state.cash_cuts = { ...state.cash_cuts, data: action.payload };
    },
    setCashCutFilters(state, action: PayloadAction<Partial<CashCutFilters>>) {
      state.cash_cuts = { ...state.cash_cuts, filters: { ...state.cash_cuts.filters, ...action.payload } };
    },
  },
});

export const cashiersActions = { ...cashiers.actions, ...customActions };

export default cashiers.reducer;
