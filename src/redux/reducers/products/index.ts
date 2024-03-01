import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { Category, Product, ProductsSlice, Size, Sizes, Unit, Units } from './types';
import customActions from './actions';

const initialState: ProductsSlice = {
  products: [],
  categories: [],
  current_category: {} as Category,
  current_product: {} as Product,
  sizes: {
    data: [],
    drawer: null,
    pagination: { lastPage: 0, nextPage: 0, total: 0 },
    selected: {} as Size,
  },
  units: {
    data: [],
    drawer: null,
    pagination: { lastPage: 0, nextPage: 0, total: 0 },
    selected: {} as Unit,
  },
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
    setCategories(state, action: PayloadAction<Category[]>) {
      state.categories = action.payload;
    },
    setCurrentCategory(state, action: PayloadAction<Category>) {
      state.current_category = action.payload;
    },
    setSize(state, action: PayloadAction<Sizes>) {
      state.sizes = { ...state.sizes, ...action.payload };
    },
    setUnit(state, action: PayloadAction<Units>) {
      state.units = { ...state.units, ...action.payload };
    },
  },
});

export const productActions = { ...products.actions, ...customActions };

export default products.reducer;
