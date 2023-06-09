import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { Product, ProductsSlice } from './types';
import customActions from './actions';

const initialState: ProductsSlice = {
  products: [],
  current_product: {} as Product,
  loading: false,
};

const products = createSlice({
  name: 'products',
  initialState,
  reducers: {
    resetSlice: () => initialState,
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setProducts(state, action: PayloadAction<Product[]>) {
      state.products = action.payload;
    },
    setCurrentProduct(state, action: PayloadAction<Product>) {
      state.current_product = action.payload;
    },
  },
});

export const productActions = { ...products.actions, ...customActions };

export default products.reducer;
