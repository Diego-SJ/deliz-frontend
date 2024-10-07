import { DateRangeKey } from '@/utils/sales-report';
import { Sale } from '../sales/types';
import { PieChartItem } from '@/types/charts';

export type AnalyticsSlice = {
  sales: SalesAnalytics;
  profit: ProfitAnalytics;
  products: ProductAnalytics;
  customers: CustomerAnalytics;
  expenses: ExpensesAnalytics;
};

export type ExpensesAnalytics = {
  loading: boolean;
  charts: {
    pie?: PieChartItem[];
    pieCustom?: PieChartItem[];
    line?: LineChartData;
    totalAmount?: number;
  };
  filters: Partial<ExpensesFilters>;
};

export type ExpensesFilters = {
  date_range: DateRangeKey;
  operational_category_ids: number[];
  branches: string[];
  custom_dates: (string | null)[];
};

export type ProfitAnalytics = {
  loading: boolean;
  data: LineChartData;
  summary_by_range: ProfitSummary;
  filters: ProfitFilters;
  summary: ProfitSummary;
};

export type ProfitFilters = {
  date_range: DateRangeKey;
  branches: string[];
  custom_dates: (string | null)[];
};

export type ProfitSummary = {
  completed_expenses: number;
  completed_sales: number;
  pending_expenses: number;
  pending_sales: number;
};

export type SalesFilters = {
  date_range: DateRangeKey;
  customers: number[];
  products: number[];
  branches: string[];
  custom_dates: (string | null)[];
  limits: {
    completed: number;
    pending: number;
  };
};

export type SalesAnalytics = {
  data: LineChartData;
  sales_summary: SalesSummary;
  last_sales: { completed: Partial<Sale>[]; pending: Partial<Sale>[] };
  total_sales_chart_data: BarChartDataItem[];
  total_sales_amount_chart_data: BarChartDataItem[];
  total: number;
  loading: boolean;
  filters: SalesFilters;
};

export type SalesSummary = {
  completed_sales: number;
  pending_sales: number;
  completed_sales_amount: number;
  pending_sales_amount: number;
};

export type BarChartData = {
  id: string | number;
  color?: string;
  data: BarChartDataItem[];
}[];

export type BarChartDataItem = {
  date: string;
  Pendiente: number | string;
  Pagado: number | string;
};

export type LineChartData = {
  id: string | number;
  color?: string;
  data: LineChartDataItem[];
}[];

export type LineChartDataItem = {
  x: string;
  y: number;
  total: number;
  [key: string]: any;
};

export type ProductAnalytics = {
  top_products: ProductTop[];
  loading: boolean;
};

export type ProductTop = {
  product_id: number;
  image_url: string;
  name: string;
  total_quantity: number;
  total_price: number;
};

export type CustomerAnalytics = {
  top_customers: CustomerTop[];
  loading: boolean;
};

export type CustomerTop = {
  name: string;
  total_amount: number;
  customer_id: number;
};
