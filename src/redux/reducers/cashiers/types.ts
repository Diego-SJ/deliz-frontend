import { Cashier, SaleDetails } from '../sales/types';
import { Profile } from '../users/types';

export type CashiersSlice = {
  active_cash_cut: CashCut | null;
  cash_cuts: {
    data: CashCut[];
    filters: Partial<CashCutFilters>;
  };
  cash_operations: CashOperations;
  cashier_detail: CashierDetail;
  loading: boolean;
  error?: string | null;
};

export type CashCutFilters = {
  cash_register_id?: string;
  branch_id?: string;
  order_by?: string;
  page?: number;
  pageSize?: number;
  total?: number;
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
  name: string;
  amount: number;
  total?: number;
  operation_type: 'EXPENSE' | 'INCOME' | 'SALE';
  payment_method: string;
  created_at: string;
  cashier_id: number;
  user_id: string;
};

export type CashOperation = {
  cash_operation_id: string;
  name?: string;
  operation_type: 'EXPENSE' | 'INCOME' | 'SALE';
  amount: number;
  created_at: string;
  payment_method: string;
  cash_register_id: string;
  branch_id: string;
  cash_cut_id: string | null;
};

export type CashCut = {
  cash_cut_id: string | null;
  branch_id: string | null;
  cash_register_id: string | null;

  notes: string;
  is_open: boolean;
  opening_date: string;
  closing_date: string | null;

  initial_amount: number;
  final_amount: number;
  received_amount: number;

  sales_amount: number;
  incomes_amount: number;
  expenses_amount: number;

  operations: CashOperation[];
  opened_by?: string | null;
  closed_by?: string | null;

  profiles?: Partial<Profile>;
};

export type FetchCashCutArgs = {
  cashCut?: CashCut | null;
  fetchSales?: boolean;
  fetchOperations?: boolean;
};

export type MoveSalePayload = {
  sale_id: number;
  new_cash_cut_id: string;
  old_cash_cut_id: string;
  cash_register_id: string;
  branch_id: string;
};
