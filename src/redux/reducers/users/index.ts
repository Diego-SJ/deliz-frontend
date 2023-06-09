import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { UserAuth, UsersSlice } from './types';
import customActions from './actions';

const initialState: UsersSlice = {
  user_auth: { user: null, session: null } as UserAuth,
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
    setUserAuth(state, action: PayloadAction<UserAuth>) {
      state.user_auth = action.payload;
    },
  },
});

export const userActions = { ...users.actions, ...customActions };

export default users.reducer;
