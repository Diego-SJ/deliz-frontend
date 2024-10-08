import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { UserAuth, UsersSlice } from './types';
import customActions from './actions';

const initialState: UsersSlice = {
  user_auth: {
    profile: {
      permissions: {} as any,
      role: null,
    },
    isAdmin: false,
    authenticated: false,
  },
  users: [],
  loading: false,
};

const users = createSlice({
  name: 'users',
  initialState,
  reducers: {
    resetSlice: () => initialState,
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setUserAuth(state, action: PayloadAction<Partial<UserAuth>>) {
      state.user_auth = { ...state.user_auth, ...action.payload };
    },
    setProfile(state, action: PayloadAction<Partial<UserAuth['profile']>>) {
      state.user_auth.profile = { ...state.user_auth.profile, ...action.payload };
    },
    setUsers(state, action: PayloadAction<UsersSlice['users']>) {
      state.users = action.payload;
    },
  },
});

export const userActions = { ...users.actions, ...customActions };

export default users.reducer;
