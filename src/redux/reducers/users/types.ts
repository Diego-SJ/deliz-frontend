export type UsersSlice = {
  user_auth: UserAuth;
  loading: boolean;
};

export type UserAuth = {
  profile: Partial<Profile> | null;
  authenticated: boolean;
};

export type Profile = {
  profile_id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  branches: string[];
  cashiers: string[];
  company_id: string;
  favorite_products: number[];
};
