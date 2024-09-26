export type AppSlice = {
  company: Company;
  navigation: {
    collapsed: boolean;
    menu: {
      activeItem: string;
      activeTitle: string;
    };
  };
  onboarding: Onboarding;
  loading: boolean;
};

export type Company = {
  company_id: string;
  name: string;
  logo_url: string | null;
  phone: string;
  email: string;
  address: string;
  theme: string;
  created_at: string;
  membership_id: number | null;
};

export type Onboarding = {
  onboarding_id: string | null;
  created_at: string;
  company_id: string;
  no_employees: number;
  business_niche: string;
  no_branches: number;
  is_ecommerce: boolean;
  status_id: number | null;
  step: number;
  owner_name: string;
  owner_last_name: string;
  accepted_terms: boolean;
  business_name: string;
  important_features: string[];
};
