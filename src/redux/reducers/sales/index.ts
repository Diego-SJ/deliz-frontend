import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import {
  CashRegister,
  Cashier,
  Cashiers,
  ClosingDays,
  CurrentSale,
  OperatingExpense,
  OperatingExpenses,
  SaleFilters,
  SaleRPC,
  SalesSlice,
} from './types';
import customActions from './actions';
import { Pagination } from '@supabase/supabase-js';

const initialState: SalesSlice = {
  sales: [],
  filters: {
    sales: {
      page: 0,
      pageSize: 20,
      totalRecords: 0,
      orderBy: 'created_at,desc',
      branch_id: null,
      status_id: 0,
      search: '',
    },
  },
  current_sale: {} as CurrentSale,
  cash_register: {
    items: [],
    discount: 0,
    status: 5, // pending
    shipping: 0,
    discountMoney: 0,
    customer_id: null,
    zone: 1,
  },
  operating_expenses: { data: [], drawer: null, pagination: {} as Pagination, selected: {} as OperatingExpense },
  cashiers: { data: [], drawer: null, pagination: {} as Pagination, selected: {} as Cashier },
  closing_days: {
    data: [],
  },
  loading: false,
};

const sales = createSlice({
  name: 'sales',
  initialState,
  reducers: {
    resetSlice: () => initialState,
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setSales(state, action: PayloadAction<SaleRPC[]>) {
      state.sales = action.payload;
    },
    setCurrentSale(state, action: PayloadAction<CurrentSale>) {
      state.current_sale = { ...state.current_sale, ...action.payload };
    },
    updateCashRegister(state, action: PayloadAction<Partial<CashRegister>>) {
      state.cash_register = { ...state.cash_register, ...action.payload };
    },
    setClosingDays(state, action: PayloadAction<ClosingDays>) {
      state.closing_days = { ...state.closing_days, ...action.payload };
    },
    setExpense(state, action: PayloadAction<OperatingExpenses>) {
      state.operating_expenses = { ...state.operating_expenses, ...action.payload };
    },
    setCashiers(state, action: PayloadAction<Cashiers>) {
      state.cashiers = { ...state.cashiers, ...action.payload };
    },
    setSaleFilters(state, action: PayloadAction<SaleFilters>) {
      state.filters = { ...state.filters, sales: { ...state.filters?.sales, ...action.payload } };
    },
  },
});

export const salesActions = { ...sales.actions, ...customActions };

export default sales.reducer;
