import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Order, OrdersSlice } from './types';
import { orderCustomActions } from './actions';

const initialState: OrdersSlice = {
  orders: [],
  currentOrder: null,
  loading: false,
};

const orders = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    resetSlice: () => initialState,
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setOrders: (state, action: PayloadAction<Order[]>) => {
      state.orders = action.payload;
    },
  },
});

export const orderActions = { ...orders.actions, ...orderCustomActions };

export default orders.reducer;
