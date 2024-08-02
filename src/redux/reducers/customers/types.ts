export type CustomersSlice = {
  customers: Customer[];
  current_customer: Partial<Customer>;
  loading: boolean;
};

export type Customer = {
  key?: number;
  customer_id: number;
  name: string;
  address?: string;
  created_at?: Date | string;
  phone?: string;
  email?: string;
  company_id: string;
};
