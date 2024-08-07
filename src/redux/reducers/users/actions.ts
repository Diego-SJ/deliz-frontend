import { supabase, supabaseAdmin } from '@/config/supabase';
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
import { PERMISSIONS, PERMISSIONS_DENIED } from '@/components/pages/settings/users/permissions/data-and-types';

const customActions = {
  fetchAppData: () => async (dispatch: AppDispatch, getState: AppState) => {
    const { profile } = getState().users.user_auth;

    await dispatch(appActions.company.getCompany(profile?.company_id));
    await dispatch(branchesActions.getBranches());
    await dispatch(branchesActions.getCashRegistersByCompanyId());

    const branches = getState().branches.branches;
    const branch = branches?.find(item => item.main_branch) || branches[0] || null;
    await dispatch(branchesActions.setCurrentBranch(branch));

    const cash_registers = getState().branches.cash_registers;
    let cash_register = cash_registers?.find(item => item.is_default && item.branch_id === branch?.branch_id) || null;
    if (!cash_register) {
      cash_register = cash_registers[0] || null;
    }
    await dispatch(branchesActions.setCurrentCashRegister(cash_register));
    await dispatch(cashiersActions.cash_cuts.fetchCashCutData());
    await dispatch(userActions.setUserAuth({ authenticated: true }));
  },
  fetchProfile: (profile_id: string) => async (dispatch: AppDispatch) => {
    const { data, error } = await supabase.from('profiles').select('*').eq('profile_id', profile_id).single();
    if (error) {
      message.error(error.message);
      return null;
    }

    const profileData = {
      ...data,
      permissions: data?.role === 'ADMIN' ? PERMISSIONS : data.permissions || null,
    };

    await dispatch(userActions.setUserAuth({ profile: profileData, isAdmin: data.role === 'ADMIN' }));
    return data;
  },
  loginSuccess: (profile_id: string) => async (dispatch: AppDispatch) => {
    let { data, error } = await supabase.from('profiles').select('*').eq('profile_id', profile_id).single();

    if (error) {
      message.error(error.message);
      return false;
    }

    const profileData = {
      ...data,
      permissions: data?.role === 'ADMIN' ? PERMISSIONS : data.permissions || null,
    };

    await dispatch(userActions.setUserAuth({ profile: profileData, authenticated: false, isAdmin: data.role === 'ADMIN' }));
    await dispatch(customActions.fetchAppData());

    return true;
  },
  signOut: () => async (dispatch: AppDispatch) => {
    await supabase.auth.signOut();
    await supabaseAdmin.auth.signOut();

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
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('company_id', company_id)
      .order('is_default', { ascending: false });
    if (error) {
      message.error(error.message);
      return;
    }
    dispatch(userActions.setUsers(data));

    return data;
  },
  createUser: (profile: Partial<Profile>) => async (dispatch: AppDispatch, getState: AppState) => {
    const totalUsers = await dispatch(userActions.getAllUsers());

    if ((totalUsers?.length || 0) >= 3) {
      message.error('No puedes registrar más de 3 usuarios');
      return null;
    }

    const company_id = getState().app.company?.company_id;
    const metadata = {
      company_id,
      first_name: profile.first_name,
      last_name: profile.last_name,
      phone: profile.phone || '',
      email: profile.email,
      password: profile.password,
      role: profile.role || 'ADMIN',
      branches: profile.branches,
      cash_registers: profile.cash_registers,
      permissions: !!Object.keys(profile.permissions || {})?.length
        ? profile.permissions
        : profile?.role === 'ADMIN'
        ? PERMISSIONS
        : PERMISSIONS_DENIED,
    } as Profile;

    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email: profile.email!,
      password: profile.password!,
      email_confirm: true,
      phone_confirm: true,
      user_metadata: metadata,
    });

    if (error) {
      message.error(error.message);
      return null;
    }

    message.success('Usuario creado correctamente');
    return data;
  },
  fetchUser: (profile_id: string) => async (): Promise<Profile | null> => {
    const { data, error } = await supabase.from('profiles').select('*').eq('profile_id', profile_id).single();
    if (error) {
      message.error(error.message);
      return null;
    }
    return data;
  },
  updateProfile: (profile: Partial<Profile>) => async (dispatch: AppDispatch, getState: AppState) => {
    const profile_id = getState().users.user_auth.profile?.profile_id;
    const metadata = {
      first_name: profile.first_name,
      last_name: profile.last_name,
      phone: profile.phone || '',
      email: profile.email,
      password: profile.password,
      role: profile.role || 'ADMIN',
      branches: profile.branches,
      cash_registers: profile.cash_registers,
      permissions: !!Object.keys(profile.permissions || {})?.length
        ? profile.permissions
        : profile?.role === 'ADMIN'
        ? PERMISSIONS
        : PERMISSIONS_DENIED,
    } as Profile;

    const { error } = await supabaseAdmin.auth.admin.updateUserById(profile.profile_id!, {
      email: profile?.email,
      password: profile.password,
      email_confirm: true,
      phone_confirm: true,
      user_metadata: metadata,
    });
    if (error) {
      message.error(error.message);
      return null;
    }

    if (profile_id === profile.profile_id) {
      let newProfile = { ...getState().users.user_auth.profile, ...metadata };
      await dispatch(userActions.setUserAuth({ profile: newProfile, authenticated: true }));
    }

    message.success('Perfil actualizado correctamente');
    return { ...getState().users.user_auth.profile, ...metadata };
  },
  deleteUser: (profile_id: string) => async () => {
    const { data, error } = await supabaseAdmin.auth.admin.deleteUser(profile_id!);

    if (error) {
      message.error(error.message);
      return false;
    }

    message.info(`Perfil eliminado correctamente`);
    return data;
  },
};

export default customActions;
