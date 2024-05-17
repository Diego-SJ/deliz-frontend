import { Pagination } from '@supabase/supabase-js';
import { Customer } from '../customers/types';
import { Category, Product } from '../products/types';

export type SalesSlice = {
  sales: SaleDetails[];
  current_sale: CurrentSale;
  cash_register: CashRegister;
  operating_expenses?: OperatingExpenses;
  cashiers?: Cashiers;
  loading: boolean;
  closing_days: ClosingDays;
};

export type DiscountType = 'PERCENTAGE' | 'AMOUNT';
export type PaymentMethod = 'CASH' | 'CARD' | 'TRANSFER';

export type ClosingDays = {
  data: CashClosing[];
  today_is_done?: boolean;
};

// sales table in DB
export type Sale = {
  key?: number;
  sale_id?: number;
  customer_id?: number;
  created_at?: Date | string;
  payment_method?: PaymentMethod;
  status_id?: number;
  discount_type?: DiscountType;
  discount?: number;
  shipping?: number;
  amount_paid?: number;
  cashback?: number;
  total?: number;
  updated_at?: string | Date;
  cashier_id?: number;
  order_due_date?: string | Date;
};

export type SaleMetadata = {
  customers?: Customer;
  status?: { status_id: number; name: string };
} & Sale;

// sales_detail table in DB
export type SaleItem = {
  key?: number;
  sale_detail_id?: number;
  created_at?: Date | string;
  product_id?: number;
  price?: number;
  quantity?: number;
  wholesale?: boolean;
  products?: Product & { categories: Category };
  sale_id?: number;
  metadata?: any;
};

export type CurrentSale = {
  metadata?: SaleDetails;
  items?: SaleItem[];
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
  customer_id?: number | string;
  mode?: 'sale' | 'order';
  zone?: number;
};

// redux cash register item
export type CashRegisterItem = {
  key?: string;
  customer_id?: number;
  product: Product;
  quantity: number;
  wholesale_price: boolean;
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
};
