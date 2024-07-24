import { supabase } from '@/config/supabase';
import { AppDispatch } from '@/redux/store';
import { customerActions } from '../customers';
import { productActions } from '../products';
import { salesActions } from '../sales';
import { userActions } from '.';
import { branchesActions } from '../branches';
import { appActions } from '../app';
import { message } from 'antd';

const customActions = {
  loginSuccess: (profile_id: string) => async (dispatch: AppDispatch) => {
    const { data, error } = await supabase.from('profiles').select('*').eq('profile_id', profile_id).single();

    if (error) {
      message.error(error.message);
      return false;
    }

    await dispatch(userActions.setUserAuth({ profile: data, authenticated: true }));

    await dispatch(appActions.company.getCompany(data.company_id));
    await dispatch(branchesActions.getBranches());
    await dispatch(branchesActions.getCashRegistersByCompanyId());
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
  },
  toggleFavoriteProduct: (product_id: number) => async (dispatch: AppDispatch, getState: any) => {
    const { profile } = getState().users.user_auth;
    let favorite_products = [...profile.favorite_products];

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
};

export default customActions;
