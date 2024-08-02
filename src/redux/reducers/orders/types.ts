import { DiscountType } from '../sales/types';

export type OrdersSlice = {
  orders: Order[];
  currentOrder: Order | null;
  loading: boolean;
};
export type Order = {
  sale_id: number;
  customer_id: number | null;
  created_at: string | null;
  payment_method: string;
  status_id: number;
  discount_type: DiscountType;
  discount: number;
  shipping: number;
  amount_paid: number;
  cashback: number;
  total: number;
  updated_at: string | null;
  order_due_date: string | null;
  cash_register_id: string | null;
  branch_id: string | null;
  company_id: string | null;

  customers: {
    name: string;
  };

  status: {
    status_id: number;
    name: string;
  };

  cashier_id: number;
};
