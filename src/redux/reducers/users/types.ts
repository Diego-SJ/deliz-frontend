import { PERMISSIONS } from '@/components/pages/settings/users/permissions/data-and-types';

export type UsersSlice = {
  user_auth: UserAuth;
  users: Profile[];
  loading: boolean;
};

export type UserAuth = {
  profile: Partial<Profile> | null;
  authenticated: boolean;
  isAdmin: boolean;
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
  cash_registers: string[];
  company_id: string;
  favorite_products: number[];
  is_default: boolean;
  is_inactive: boolean;
  permissions: typeof PERMISSIONS | null;
};
