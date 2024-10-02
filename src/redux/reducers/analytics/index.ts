import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  AnalyticsSlice,
  CustomerAnalytics,
  LineChartData,
  ProductAnalytics,
  ProfitAnalytics,
  ProfitFilters,
  ProfitSummary,
  SalesAnalytics,
  SalesSummary,
} from './types';
import { analyticsCustomActions } from './actions';
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import isoWeek from 'dayjs/plugin/isoWeek';

dayjs.extend(advancedFormat);
dayjs.extend(isoWeek);

const today = dayjs();

export const initialData: LineChartData = [
  {
    id: 'sales_report',
    data: Array.from({ length: 7 }, (_, i) => ({
      x: today.subtract(6 - i, 'day').format('D MMM'),
      y: 0,
      total: 0,
    })),
  },
];

const initialState: AnalyticsSlice = {
  sales: {
    data: initialData,
    sales_summary: { completed_sales: 0, pending_sales: 0, completed_sales_amount: 0, pending_sales_amount: 0 },
    last_sales: { completed: [], pending: [] },
    total_sales_chart_data: [],
    total_sales_amount_chart_data: [],
    filters: {
      branches: [],
      customers: [],
      date_range: 'last_7_days',
      products: [],
      limits: { completed: 5, pending: 5 },
      custom_dates: [null, null],
    },
    total: 0,
    loading: false,
  },
  profit: {
    data: initialData,
    filters: {
      branches: [],
      date_range: 'last_7_days',
      custom_dates: [null, null],
    },
    summary: {
      completed_expenses: 0,
      completed_sales: 0,
      pending_expenses: 0,
      pending_sales: 0,
    },
    summary_by_range: {
      completed_expenses: 0,
      completed_sales: 0,
      pending_expenses: 0,
      pending_sales: 0,
    },
    loading: false,
  },
  products: {
    top_products: [],
    loading: false,
  },
  customers: {
    top_customers: [],
    loading: false,
  },
};

const analytics = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    resetSlice: () => initialState,
    setSales: (state, action: PayloadAction<Partial<SalesAnalytics>>) => {
      state.sales = { ...state.sales, ...action.payload };
    },
    setProducts: (state, action: PayloadAction<Partial<ProductAnalytics>>) => {
      state.products = { ...state.products, ...action.payload };
    },
    setCustomers: (state, action: PayloadAction<Partial<CustomerAnalytics>>) => {
      state.customers = { ...state.customers, ...action.payload };
    },
    setSalesFilters: (state, action: PayloadAction<Partial<SalesAnalytics['filters']>>) => {
      state.sales.filters = { ...state.sales.filters, ...action.payload };
    },
    setSalesSummary: (state, action: PayloadAction<Partial<SalesSummary>>) => {
      state.sales.sales_summary = { ...state.sales.sales_summary, ...action.payload };
    },
    setProfitAnalytics: (state, action: PayloadAction<Partial<ProfitAnalytics>>) => {
      if (!state.profit) {
        state = { ...state, profit: { ...initialState.profit } };
      }
      state.profit = { ...state.profit, ...action.payload };
    },
    setProfitData: (state, action: PayloadAction<LineChartData>) => {
      if (!state.profit) {
        state = { ...state, profit: { ...initialState.profit } };
      }
      state.profit = { ...state.profit, data: action.payload || [] };
    },
    setProfitFilters: (state, action: PayloadAction<Partial<ProfitFilters>>) => {
      if (!state.profit) {
        state = { ...state, profit: { ...initialState.profit } };
      }
      state.profit.filters = { ...state.profit.filters, ...action.payload };
    },
    setProfitSummary: (state, action: PayloadAction<Partial<ProfitSummary>>) => {
      if (!state?.profit || !state?.profit?.summary) {
        state = { ...state, profit: { ...initialState.profit, summary: initialState.profit.summary } };
      }
      state.profit.summary = { ...state.profit.summary, ...action.payload };
    },
  },
});

export const analyticsActions = { ...analytics.actions, ...analyticsCustomActions };

export default analytics.reducer;
