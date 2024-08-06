export type OperatingCostsSlice = {
  operatingCosts: OperatingCost[];
  loading: boolean;
  filters: FetchOperationsFilters;
};

export type OperatingCost = {
  operating_cost_id: string;
  created_at: string;
  operation_date: string;
  reason: string;
  amount: number;
  notes: string;
  supplier_id: string;
  status_id: number;
  operation_type: string;
  cash_register_id: string;
  branch_id: string;
  company_id: string;
};

export type FetchOperationsFilters = {
  status_id?: number;
  operation_type?: string;
  operation_date?: string;
  branch_id?: string;
  search_text?: string;
};
