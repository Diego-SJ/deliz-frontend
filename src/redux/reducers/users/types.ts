export type UsersSlice = {
  user_auth: UserAuth;
  users: Profile[];
  loading: boolean;
};

export type UserAuth = {
  profile: Partial<Profile> | null;
  authenticated: boolean;
};

export type Profile = {
  profile_id: string;
  password: string;
  email: string;
  phone: string;
  first_name: string;
  last_name: string;
  role: string;
  branches: string[];
  cashiers: string[];
  company_id: string;
  favorite_products: number[];
};
