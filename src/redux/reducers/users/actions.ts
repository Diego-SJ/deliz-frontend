import { supabase } from '@/config/supabase';
import { AppDispatch } from '@/redux/store';
import { message } from 'antd';
import { customerActions } from '../customers';
import { productActions } from '../products';
import { salesActions } from '../sales';
import { userActions } from '.';

const customActions = {
  signOut: () => async (dispatch: AppDispatch) => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      message.error(error.message);
    } else {
      dispatch(customerActions.resetSlice());
      dispatch(productActions.resetSlice());
      dispatch(salesActions.resetSlice());
      dispatch(userActions.resetSlice());
    }
  },
};

export default customActions;
