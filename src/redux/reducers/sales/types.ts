import { Pagination } from '@supabase/supabase-js';
import { Customer } from '../customers/types';
import { Category, Product } from '../products/types';

export type SalesSlice = {
  sales: SaleRPC[];
  filters?: {
    sales?: SaleFilters;
  };
  current_sale: CurrentSale;
  cash_register: Partial<CashRegister>;
  operating_expenses?: OperatingExpenses;
  cashiers?: Cashiers;
  loading: boolean;
  closing_days: ClosingDays;
};

export type SaleFilters = {
  page?: number;
  pageSize?: number;
  totalRecords?: number;
  orderBy?: string;
  branch_id?: string | null;
  status_id?: number | null;
  search?: string;
};

export const PAYMENT_METHOD_NAME = {
  CASH: 'en efectivo',
  CC: 'con tarjeta',
  DC: 'con tarjeta',
  CARD: 'con tarjeta',
  TRANSFER: 'por transferencia',
};

export type DiscountType = 'PERCENTAGE' | 'AMOUNT';

export type ClosingDays = {
  data: CashClosing[];
  today_is_done?: boolean;
};

// sales table in DB
export type Sale = {
  sale_id?: number;
  customer_id?: number | null;
  created_at?: Date | string;
  payment_method?: string;
  status_id?: number;
  discount_type?: DiscountType;
  discount?: number;
  shipping?: number;
  amount_paid?: number;
  cashback?: number;
  total?: number;
  updated_at?: string | Date;
  order_due_date?: string | Date;
  cashier_id?: number;
  cash_register_id: string | null;
  branch_id: string | null;
  company_id: string | null;
  cash_cut_id: string | null;
};

export type SaleMetadata = {
  customers?: Customer;
  status?: { status_id: number; name: string };
} & Sale;

// sales_detail table in DB
export type SaleItem = {
  sale_detail_id?: number;
  created_at?: Date | string;
  product_id?: number;
  price?: number;
  quantity?: number;
  wholesale?: boolean | null;
  products?: Product & { categories: Category };
  sale_id?: number;
  branch_id?: string;
  metadata?: {
    price_type?: 'DEFAULT' | 'PERSONALIZED';
    product_name?: string;
    [key: string]: any;
  };
};

export type CurrentSale = {
  metadata?: SaleDetails;
  items?: SaleItem[];
};

export type SaleRPC = {
  created_at: string; // La fecha y hora se manejan como cadenas en este caso
  customer_address: string;
  customer_id: number | null; // Puede ser un número o null
  customer_name: string;
  customer_phone: string;
  full_count: number;
  sale_id: number;
  status_id: number;
  status_name: string;
  total: number;
  payment_method: string;
};

export type SaleDetails = {
  key?: number;
  created_at: Date | string;
  customer_id: number;
  customers: Customer;
  status: { status_id: number; name: string };
} & Sale;

// redux cash register
export type CashRegister = {
  items?: CashRegisterItem[];
  shipping?: number;
  discount?: number;
  discountType?: DiscountType;
  discountMoney?: number;
  status?: number;
  customer_id: number | null;
  mode?: 'sale' | 'order';
  zone?: number;
  branch_id: string | null;
  price_id: string | null;
};

// redux cash register item
export type CashRegisterItem = {
  id: string;
  customer_id: number | null;
  product: Partial<Product> | null;
  quantity: number;
  price: number;
  price_type: 'DEFAULT' | 'PERSONALIZED';
  created_at?: Date | string;
};

// cash_closing table in BD
export type CashClosing = {
  cash_closing_id?: number;
  amount?: number;
  closing_date?: string | Date;
  created_at?: string | Date;
  total_sales?: number;
  description?: string;
};

export type OperatingExpense = {
  key?: number;
  expense_id?: number;
  expense_name: string;
  description?: string;
  amount: number;
  created_at?: string | Date;
  payment_method?: string;
  months_without_interest?: string;
};

export type OperatingExpenses = {
  selected?: OperatingExpense;
  drawer?: 'new' | 'edit' | null;
  pagination?: Pagination;
  data?: OperatingExpense[];
};

export type Cashier = {
  key?: number;
  cashier_id?: number;
  name: string;
  initial_amount?: number;
  final_amount?: number;
  received_amount?: number;
  created_at?: string | Date;
  close_date?: string;
  is_open?: boolean;
  branch_id?: string;
  sales_amount?: number;
  incomes_amount?: number;
  expenses_amount?: number;
};

export type Cashiers = {
  selected?: Cashier;
  activeCashier?: Cashier;
  drawer?: 'new' | 'edit' | null;
  pagination?: Pagination;
  data?: Cashier[];
  salesByCashier?: Sale[];
};
