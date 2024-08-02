import { supabase } from '@/config/supabase';
import { AppDispatch, AppState } from '@/redux/store';
import { customerActions } from '../customers';
import { productActions } from '../products';
import { salesActions } from '../sales';
import { userActions } from '.';
import { branchesActions } from '../branches';
import { appActions } from '../app';
import { message } from 'antd';
import { orderActions } from '../orders';
import { cashiersActions } from '../cashiers';
import { Profile } from './types';

const customActions = {
  loginSuccess: (profile_id: string) => async (dispatch: AppDispatch, getState: AppState) => {
    const { data, error } = await supabase.from('profiles').select('*').eq('profile_id', profile_id).single();

    if (error) {
      message.error(error.message);
      return false;
    }

    await dispatch(userActions.setUserAuth({ profile: data, authenticated: true }));

    await dispatch(appActions.company.getCompany(data.company_id));
    await dispatch(branchesActions.getBranches());
    await dispatch(branchesActions.getCashRegistersByCompanyId());

    const branches = getState().branches.branches;
    const branch = branches?.find(item => item.main_branch) || null;
    await dispatch(branchesActions.setCurrentBranch(branch));

    const cash_registers = getState().branches.cash_registers;
    const cash_register = cash_registers?.find(item => item.is_default) || null;
    await dispatch(branchesActions.setCurrentCashRegister(cash_register));

    await dispatch(cashiersActions.cash_cuts.fetchCashCutData());
    return true;
  },
  signOut: () => async (dispatch: AppDispatch) => {
    await supabase.auth.signOut();

    dispatch(customerActions.resetSlice());
    dispatch(productActions.resetSlice());
    dispatch(salesActions.resetSlice());
    dispatch(userActions.resetSlice());
    dispatch(branchesActions.resetSlice());
    dispatch(appActions.resetSlice());
    dispatch(orderActions.resetSlice());
    dispatch(cashiersActions.resetSlice());
  },
  toggleFavoriteProduct: (product_id: number) => async (dispatch: AppDispatch, getState: any) => {
    const { profile } = getState().users.user_auth;
    let favorite_products = [...(profile?.favorite_products || [])];

    if (favorite_products.includes(product_id)) {
      favorite_products.splice(favorite_products.indexOf(product_id), 1);
    } else {
      favorite_products.push(product_id);
    }

    const { data } = await supabase
      .from('profiles')
      .update({ favorite_products })
      .eq('profile_id', profile.profile_id)
      .select()
      .single();
    await dispatch(userActions.setProfile({ favorite_products: data.favorite_products || [] }));
  },
  getAllUsers: () => async (dispatch: AppDispatch, getState: AppState) => {
    const company_id = getState().app.company?.company_id;
    const { data, error } = await supabase.from('profiles').select('*').eq('company_id', company_id);
    if (error) {
      message.error(error.message);
      return;
    }
    dispatch(userActions.setUsers(data));
  },
  createUser: (profile: Partial<Profile>) => async (dispatch: AppDispatch, getState: AppState) => {
    const company_id = getState().app.company?.company_id;
    const { data, error } = await supabase.auth.signUp({
      email: profile.email!,
      password: profile.password!,
      options: {
        data: {
          company_id,
          password: profile.password,
          phone: profile.phone || '',
          firs_name: profile.first_name,
          last_name: profile.last_name,
          role: profile.role || 'ADMIN',
        },
      },
    });
    if (error) {
      message.error(error.message);
      return null;
    }
    return data;
  },
};

export default customActions;
