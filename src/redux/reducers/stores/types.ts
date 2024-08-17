export type StoresSlice = {
  store: Partial<CompanyStore> | null;
  loading: boolean;
};

export type CompanyStore = {
  store_id: string | null;
  created_at: string; // Assuming 'timestamp with time zone' is represented as an ISO string
  slug: string;
  name: string;
  logo_url: string | null;
  description: string;
  social_media: SocialMedia; // JSONB can be represented as a generic object
  schedule: ScheduleStore; // JSONB can be represented as a generic object
  delivery_types: DeliveryTypesStore; // JSONB can be represented as a generic object
  phone: string;
  email: string;
  location_url: string;
  wifi: WifiCredentials; // JSONB can be represented as a generic object
  is_active: boolean;
  products: string;
  company_id: string;
  status_id: number;
  allow_orders_by_whatsapp: boolean;
};

export type WifiCredentials = {
  network: string;
  password: string;
};

export type DeliveryTypesStore = {
  on_site: boolean;
  take_away: boolean;
  home_delivery: boolean;
};

export type SocialMedia = {
  facebook: string;
  instagram: string;
  whatsapp: string;
};

export type ScheduleStore = {
  friday: {
    to: string;
    from: string;
    closed: boolean;
  };
  monday: {
    to: string;
    from: string;
    closed: boolean;
  };
  sunday: {
    to: string;
    from: string;
    closed: boolean;
  };
  tuesday: {
    to: string;
    from: string;
    closed: boolean;
  };
  saturday: {
    to: string;
    from: string;
    closed: boolean;
  };
  thursday: {
    to: string;
    from: string;
    closed: boolean;
  };
  wednesday: {
    to: string;
    from: string;
    closed: boolean;
  };
};
