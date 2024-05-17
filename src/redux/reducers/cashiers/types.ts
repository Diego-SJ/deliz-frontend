import { Cashier, PaymentMethod, SaleDetails } from '../sales/types';

export type CashiersSlice = {
  cash_operations: CashOperations;
  cashier_detail: CashierDetail;
  loading: boolean;
  error?: string | null;
};

export type CashierDetail = {
  data?: Cashier;
  operations?: OperationItem[];
};

export type CashOperations = {
  data?: CashOperation[];
  sales_by_cashier?: SaleDetails[];
  initial_amount?: number;
  sales_amount?: number;
  incomes_amount?: number;
  expenses_amount?: number;
  total_amount?: number;
  selected?: CashOperation;
  operations?: OperationItem[];
};

export type OperationItem = {
  key: string;
  name: string;
  amount: number;
  operation_type: 'EXPENSE' | 'INCOME' | 'SALE';
  payment_method: PaymentMethod;
  created_at: string;
  cashier_id: number;
  user_id: string;
};

export type CashOperation = {
  key?: string;
  cash_operation_id: string;
  name?: string;
  operation_type: 'EXPENSE' | 'INCOME';
  amount: number;
  created_at: string;
  user_id?: string;
  cashier_id: number;
  payment_method: PaymentMethod;
};
