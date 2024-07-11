export type AppSlice = {
  business: Business;
};

export type Business = {
  business_id: string;
  name: string;
  logo_url: string | null;
  phone: string;
  email: string;
  address: string;
  theme: string;
  created_at: string;
};
