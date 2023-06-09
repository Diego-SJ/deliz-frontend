export type UsersSlice = {
  user_auth: UserAuth;
  loading: boolean;
};

export type UserAuth = {
  session?: {
    access_token: string;
    expires_at: number;
    expires_in: number;
    refresh_token: string;
    token_type: string;
  } | null;
  user: {
    aud: string;
    confirmed_at: string;
    created_at: string;
    email: string;
    email_confirmed_at: string;
    id: string;
    identities: any[];
    last_sign_in_at: string;
    phone: string;
    role: string;
    updated_at: string;
    user_metadata: any;
  } | null;
};
