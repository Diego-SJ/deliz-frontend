import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AnalyticsSlice, LineChartData, ProductAnalytics, SalesAnalytics } from './types';
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
    total: 0,
    loading: false,
  },
  products: {
    top_products: [],
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
  },
});

export const analyticsActions = { ...analytics.actions, ...analyticsCustomActions };

export default analytics.reducer;
