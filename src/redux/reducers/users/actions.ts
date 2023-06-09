import { supabase } from '@/config/supabase';
import { AppDispatch } from '@/redux/store';
import { customerActions } from '../customers';
import { productActions } from '../products';
import { salesActions } from '../sales';
import { userActions } from '.';

const customActions = {
  signOut: () => async (dispatch: AppDispatch) => {
    await supabase.auth.signOut();

    dispatch(customerActions.resetSlice());
    dispatch(productActions.resetSlice());
    dispatch(salesActions.resetSlice());
    dispatch(userActions.resetSlice());
  },
};

export default customActions;
