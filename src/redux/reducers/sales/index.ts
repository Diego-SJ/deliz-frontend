import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { CashRegister, CurrentSale, Sale, SaleDetails, SalesSlice } from './types';
import customActions from './actions';

const initialState: SalesSlice = {
  sales: [],
  current_sale: {} as CurrentSale,
  cash_register: {
    items: [],
    discount: 0,
    status: 5, // pending
    shipping: 0,
    discountMoney: 0,
    customer_id: 0,
  },
  loading: false,
};

const sales = createSlice({
  name: 'sales',
  initialState,
  reducers: {
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
  },
});

export const salesActions = { ...sales.actions, ...customActions };

export default sales.reducer;
