import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import {
  CashRegister,
  Cashier,
  Cashiers,
  ClosingDays,
  CurrentSale,
  OperatingExpense,
  OperatingExpenses,
  SaleDetails,
  SalesSlice,
} from './types';
import customActions from './actions';
import { Pagination } from '@supabase/supabase-js';

const initialState: SalesSlice = {
  sales: [],
  current_sale: {} as CurrentSale,
  cash_register: {
    items: [],
    discount: 0,
    status: 5, // pending
    shipping: 0,
    discountMoney: 0,
    customer_id: '',
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
    setSales(state, action: PayloadAction<SaleDetails[]>) {
      state.sales = action.payload;
    },
    setCurrentSale(state, action: PayloadAction<CurrentSale>) {
      state.current_sale = { ...state.current_sale, ...action.payload };
    },
    updateCashRegister(state, action: PayloadAction<CashRegister>) {
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
  },
});

export const salesActions = { ...sales.actions, ...customActions };

export default sales.reducer;
