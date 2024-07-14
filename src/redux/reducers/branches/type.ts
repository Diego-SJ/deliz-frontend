export type BranchesSlice = {
  currentBranch: Partial<Branch> | null;
  branches: Branch[];
  cuurentPrices: Partial<Price> | null;
  prices_list: Price[];
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
