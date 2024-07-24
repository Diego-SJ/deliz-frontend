import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { Branch, BranchesSlice, CashRegister, Price } from './type';
import { customActions } from './actions';

const initialState: BranchesSlice = {
  currentBranch: null,
  branches: [],
  prices_list: [],
  cuurentPrices: null,
  currentCashRegister: null,
  cash_registers: [],
};

const branches = createSlice({
  name: 'branches',
  initialState,
  reducers: {
    resetSlice: () => initialState,
    setCurrentBranch: (state, action: PayloadAction<Partial<Branch> | null>) => {
      state.currentBranch = action.payload;
    },
    setBranches: (state, action: PayloadAction<Branch[]>) => {
      state.branches = action.payload;
    },
    setPricesList: (state, action: PayloadAction<Price[]>) => {
      state.prices_list = action.payload;
    },
    setCurrentPrices: (state, action: PayloadAction<Partial<Price> | null>) => {
      state.cuurentPrices = action.payload;
    },
    setCurrentCashRegister: (state, action: PayloadAction<Partial<CashRegister> | null>) => {
      state.currentCashRegister = action.payload;
    },
    setCashRegisters: (state, action: PayloadAction<CashRegister[]>) => {
      state.cash_registers = action.payload;
    },
  },
});

export const branchesActions = { ...branches.actions, ...customActions };

export default branches.reducer;
