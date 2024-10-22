import { DateRangeKey } from '@/utils/sales-report';
import { Sale } from '../sales/types';
import { PieChartItem } from '@/types/charts';
import { Inventory } from '../products/types';

export type AnalyticsSlice = {
  sales: SalesAnalytics;
  profit: ProfitAnalytics;
  products: ProductAnalytics;
  customers: CustomerAnalytics;
  expenses: ExpensesAnalytics;
  users: UserAnalytics;
};

export type UserAnalytics = {
  loading: boolean;
  filters: {
    date_range: DateRangeKey;
    custom_dates: (string | null)[];
  };
  charts: {
    total_sales: PieChartItem[];
    total_amount: PieChartItem[];
  };
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
  products_to_replenish: ProductToReplenish[];
  filters: {
    limit: number;
    date_range: DateRangeKey;
    custom_dates: (string | null)[];
    order: 'asc' | 'desc';
  };
  loading: boolean;
};

export type ProductToReplenish = {
  product_id: number;
  name: string;
  min_stock: number;
  total_stock: number;
  inventory: Inventory;
  image_url: string;
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
  total_customers: number;
  debtor_customers: DebtorCustomers;
  last_customer_sales: {
    data: LastCustomerSale[];
    filters: {
      date_range: DateRangeKey;
      custom_dates: (string | null)[];
      order_by: string;
    };
  };
  loading: boolean;
};

export type LastCustomerSale = {
  customer_id: number;
  customer_name: string;
  total_sales: number;
  total_amount: number;
};

export type CustomerTop = {
  name: string;
  total_amount: number;
  customer_id: number;
};

export type DebtorCustomers = {
  data: DebtorCustomer[];
  total: number;
};

export type DebtorCustomer = {
  customer_id: number;
  customer_name: string;
  sales: Partial<Sale>[];
};
