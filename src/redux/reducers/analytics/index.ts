import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  AnalyticsSlice,
  CustomerAnalytics,
  ExpensesAnalytics,
  ExpensesFilters,
  LastCustomerSale,
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
    sales_summary: {
      completed_sales: 0,
      pending_sales: 0,
      completed_sales_amount: 0,
      pending_sales_amount: 0,
    },
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
  expenses: {
    loading: false,
    charts: { line: [], pie: [], pieCustom: [], totalAmount: 0 },
    filters: {
      branches: [],
      date_range: 'last_7_days',
      custom_dates: [null, null],
      operational_category_ids: [],
    },
  },
  products: {
    top_products: [],
    loading: false,
  },
  customers: {
    top_customers: [],
    total_customers: 0,
    last_customer_sales: {
      data: [],
      filters: {
        custom_dates: [null, null],
        date_range: 'last_7_days',
        order_by: 'total_amount,desc',
      },
    },
    loading: false,
  },
};

const analytics = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    resetSlice: () => initialState,
    setLastCustomerSales: (
      state,
      action: PayloadAction<LastCustomerSale[]>,
    ) => {
      if (!state?.customers?.last_customer_sales) {
        state.customers = {
          ...state.customers,
          last_customer_sales: initialState.customers.last_customer_sales,
        };
      }
      state.customers.last_customer_sales = {
        ...state.customers.last_customer_sales,
        data: action.payload,
      };
    },
    setCustomerSalesFilters: (
      state,
      action: PayloadAction<
        Partial<CustomerAnalytics['last_customer_sales']['filters']>
      >,
    ) => {
      if (!state?.customers?.last_customer_sales) {
        state.customers = {
          ...state.customers,
          last_customer_sales: initialState.customers.last_customer_sales,
        };
      }
      state.customers.last_customer_sales = {
        ...state.customers.last_customer_sales,
        filters: {
          ...state.customers.last_customer_sales.filters,
          ...action.payload,
        },
      };
    },
    setSales: (state, action: PayloadAction<Partial<SalesAnalytics>>) => {
      state.sales = { ...state.sales, ...action.payload };
    },
    setProducts: (state, action: PayloadAction<Partial<ProductAnalytics>>) => {
      state.products = { ...state.products, ...action.payload };
    },
    setCustomers: (
      state,
      action: PayloadAction<Partial<CustomerAnalytics>>,
    ) => {
      state.customers = { ...state.customers, ...action.payload };
    },
    setSalesFilters: (
      state,
      action: PayloadAction<Partial<SalesAnalytics['filters']>>,
    ) => {
      state.sales.filters = { ...state.sales.filters, ...action.payload };
    },
    setSalesSummary: (state, action: PayloadAction<Partial<SalesSummary>>) => {
      state.sales.sales_summary = {
        ...state.sales.sales_summary,
        ...action.payload,
      };
    },
    setProfitAnalytics: (
      state,
      action: PayloadAction<Partial<ProfitAnalytics>>,
    ) => {
      if (!state.profit) {
        state = { ...state, profit: { ...initialState.profit } };
      }
      state.profit = { ...state.profit, ...action.payload };
    },
    setProfitFilters: (
      state,
      action: PayloadAction<Partial<ProfitFilters>>,
    ) => {
      if (!state.profit) {
        state = { ...state, profit: { ...initialState.profit } };
      }
      state.profit.filters = { ...state.profit.filters, ...action.payload };
    },
    setProfitSummary: (
      state,
      action: PayloadAction<Partial<ProfitSummary>>,
    ) => {
      if (!state?.profit || !state?.profit?.summary) {
        state.profit = {
          ...state.profit,
          summary: { ...state?.profit?.summary, ...action?.payload },
        };
      } else {
        state.profit.summary = { ...state.profit.summary, ...action.payload };
      }
    },
    setExpensesFilters: (
      state,
      action: PayloadAction<Partial<ExpensesFilters>>,
    ) => {
      state.expenses = {
        ...state.expenses,
        filters: { ...state?.expenses?.filters, ...action.payload },
      };
    },
    setExpensesData: (
      state,
      action: PayloadAction<Partial<ExpensesAnalytics>>,
    ) => {
      state.expenses = { ...state.expenses, ...action.payload };
    },
    setExpensesCharts: (
      state,
      action: PayloadAction<Partial<ExpensesAnalytics['charts']>>,
    ) => {
      state.expenses.charts = { ...state?.expenses?.charts, ...action.payload };
    },
  },
});

export const analyticsActions = {
  ...analytics.actions,
  ...analyticsCustomActions,
};

export default analytics.reducer;
