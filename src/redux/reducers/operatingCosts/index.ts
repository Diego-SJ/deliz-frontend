import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { OperatingCost, OperatingCostsSlice } from './types';
import { customOperatingCostsActions } from './actions';

const initialState: OperatingCostsSlice = {
  operatingCosts: [],
  filters: {
    status_id: 0,
    operation_type: 'ALL',
    branch_id: '',
  },
  loading: false,
};

const operatingCosts = createSlice({
  name: 'operatingCosts',
  initialState,
  reducers: {
    resetSlice: () => initialState,
    setOperatingCosts: (state, action: PayloadAction<OperatingCost[]>) => {
      state.operatingCosts = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setFilters: (state, action: PayloadAction<OperatingCostsSlice['filters']>) => {
      state.filters = { ...state?.filters, ...action?.payload };
    },
  },
});

export const operatingCostsActions = { ...operatingCosts.actions, ...customOperatingCostsActions };

export default operatingCosts.reducer;
