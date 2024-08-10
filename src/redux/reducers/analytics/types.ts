export type AnalyticsSlice = {
  sales: SalesAnalytics;
  products: ProductAnalytics;
  customers: CustomerAnalytics;
};

export type SalesAnalytics = {
  data: LineChartData;
  total: number;
  loading: boolean;
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
