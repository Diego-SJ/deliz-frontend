import { Customer } from '../customers/types';
import { Category, Product } from '../products/types';

export type SalesSlice = {
  sales: SaleDetails[];
  current_sale: CurrentSale;
  cash_register: CashRegister;
  loading: boolean;
};

export type DiscountType = 'PERCENTAGE' | 'AMOUNT';

// sales table in DB
export type Sale = {
  key?: number;
  sale_id?: number;
  customer_id?: number;
  created_at?: Date | string;
  payment_method?: 'CASH' | 'CARD' | 'TRANSFER';
  status_id?: number;
  discount_type?: DiscountType;
  discount?: number;
  shipping?: number;
  amount_paid?: number;
  cashback?: number;
  total?: number;
};

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
  discount: number;
  discount_type: DiscountType;
  payment_method: string;
  sale_id: number;
  shipping: number;
  status: { status_id: number; name: string };
  status_id: number;
  amount_paid?: number;
  cashback?: number;
  total?: number;
};

// redux cash register
export type CashRegister = {
  items?: CashRegisterItem[];
  shipping?: number;
  discount?: number;
  discountType?: DiscountType;
  discountMoney?: number;
  status?: number;
  customer_id?: number | string;
};

// redux cash register item
export type CashRegisterItem = {
  key?: string;
  customer_id?: number;
  product: Product;
  quantity: number;
  wholesale_price: boolean;
};
