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

    await dispatch(appActions.business.getBusiness(data.business_id));
    await dispatch(userActions.setUserAuth({ profile: data, authenticated: true }));
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
};

export default customActions;
