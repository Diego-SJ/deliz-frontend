export type BranchesSlice = {
  currentBranch: Partial<Branch> | null;
  branches: Branch[];
  cuurentPrices: Partial<Price> | null;
  prices_list: Price[];
  currentCashRegister: Partial<CashRegister> | null;
  cash_registers: CashRegister[];
};

export type Branch = {
  branch_id: string;
  name: string;
  street: string;
  ext_number: string;
  int_number: string;
  zip_code: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  created_at: string;
  main_branch: boolean;
};

export type Price = {
  price_id: string;
  name: string;
  created_at: string;
  is_default: boolean;
};

export type CashRegister = {
  cash_register_id: string;
  company_id: string;
  branch_id: string;
  created_at: string;
  name: string;
  is_default: boolean;
};
