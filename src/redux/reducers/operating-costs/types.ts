import { Dayjs } from 'dayjs';
import { Branch } from '../branches/type';

export type OperatingCostsSlice = {
  operatingCosts: OperatingCost[];
  loading: boolean;
  filters: FetchOperationsFilters;
};

export type OperatingCost = {
  operating_cost_id: string;
  created_at: string;
  operation_date: string | Dayjs;
  reason: string;
  amount: number;
  notes: string;
  supplier_id: string;
  status_id: number;
  images: string[];
  operation_type: string;
  cash_register_id: string;
  branch_id: string;
  company_id: string;
  branches?: Branch;
  operational_category_id?: number;
};

export type FetchOperationsFilters = {
  status_id?: number;
  operation_type?: string;
  operation_date?: string;
  branch_id?: string;
  search_text?: string;
  page?: number;
  pageSize?: number;
  totalRecords?: number;
};
