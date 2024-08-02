export type AppSlice = {
  company: Company;
  navigation: {
    menu: {
      activeItem: string;
      activeTitle: string;
    };
  };
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
};
