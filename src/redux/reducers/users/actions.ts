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
import { STATUS_DATA } from '@/constants/status';
import { Company } from '../app/types';
import { ROLES } from '@/constants/roles';
import { operatingCostsActions } from '../operatingCosts';
import { analyticsActions } from '../analytics';
import { storesActions } from '../stores';

const customActions = {
  fetchAppData: () => async (dispatch: AppDispatch, getState: AppState) => {
    const { profile } = getState().users.user_auth;

    if (profile?.profile_id) {
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
    }
  },
  fetchAppDataOnLogin: () => async (dispatch: AppDispatch, getState: AppState) => {
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
    await dispatch(userActions.setUserAuth({ authenticated: true }));
  },
  fetchProfile: (profile_id: string) => async (dispatch: AppDispatch) => {
    const { data, error } = await supabase.from('profiles').select('*').eq('profile_id', profile_id).single();
    if (error) {
      message.error('No se pudo obtener el perfil');
      dispatch(userActions.signOut());
      return null;
    }

    const profileData = {
      ...data,
      permissions: data?.role === ROLES.ADMIN ? PERMISSIONS : data.permissions || null,
    };

    await dispatch(userActions.setUserAuth({ profile: profileData, isAdmin: data.role === 'ADMIN' }));
    return data;
  },
  loginSuccess: (profile_id: string) => async (dispatch: AppDispatch) => {
    let [{ data, error }] = await Promise.all([supabase.from('profiles').select('*').eq('profile_id', profile_id).single()]);

    if (error) {
      message.error(error.message);
      dispatch(userActions.signOut());
      return false;
    }
    const { data: onboarding, error: onbError } = await supabase
      .from('onboarding')
      .select('*')
      .eq('company_id', data.company_id)
      .single();

    if (onbError) {
      message.error(onbError.message);
      dispatch(userActions.signOut());
      return false;
    }
    await dispatch(appActions.setOnboarding(onboarding));

    //onboarding pending
    if (data.role === ROLES.ONBOARDING_PENDING) {
      await dispatch(appActions.company.getCompany(data.company_id));
      await dispatch(
        userActions.setUserAuth({
          profile: { ...data, permissions: PERMISSIONS },
          authenticated: true,
          isAdmin: true,
        }),
      );
      return true;
    }

    // onboarding completed

    await dispatch(
      userActions.setUserAuth({
        profile: {
          ...data,
          permissions: data?.role === ROLES.ADMIN ? PERMISSIONS : data.permissions || null,
        },
        authenticated: false,
        isAdmin: data.role === ROLES.ADMIN,
      }),
    );
    await dispatch(customActions.fetchAppDataOnLogin());

    return true;
  },
  signOut: () => async (dispatch: AppDispatch) => {
    await supabase.auth.signOut();
    await supabaseAdmin.auth.signOut();

    dispatch(customerActions.resetSlice());
    dispatch(analyticsActions.resetSlice());
    dispatch(productActions.resetSlice());
    dispatch(salesActions.resetSlice());
    dispatch(branchesActions.resetSlice());
    dispatch(orderActions.resetSlice());
    dispatch(cashiersActions.resetSlice());
    dispatch(userActions.resetSlice());
    dispatch(operatingCostsActions.resetSlice());
    dispatch(appActions.resetSlice());
    dispatch(storesActions.resetSlice());
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
      role: profile.role || ROLES.ADMIN,
      branches: profile.branches,
      cash_registers: profile.cash_registers,
      permissions: !!Object.keys(profile.permissions || {})?.length
        ? profile.permissions
        : profile?.role === ROLES.ADMIN
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

    const { data, error: profileError } = await supabase
      .from('profiles')
      .update(metadata)
      .eq('profile_id', profile.profile_id)
      .select()
      .single();

    if (profileError) {
      message.error(profileError.message);
      return null;
    }

    let newProfile = { ...getState()?.users?.user_auth?.profile, ...data };
    if (profile_id === data?.profile_id) {
      await dispatch(userActions.setUserAuth({ profile: newProfile, authenticated: true }));
    }

    message.success('Perfil actualizado correctamente');
    return newProfile;
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
  signUp: (profile: Partial<Profile>) => async (dispatch: AppDispatch) => {
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email: profile.email,
      password: profile.password,
      email_confirm: true,
      phone_confirm: true,
      user_metadata: {
        phone: profile.phone || '',
        email: profile.email,
        password: profile.password,
        role: ROLES.ONBOARDING_PENDING,
        permissions: PERMISSIONS,
      },
    });

    if (error) {
      if (error.code === 'email_exists') return message.info('El correo ya está registrado, inicia sesión para continuar.', 5);
      message.error(error?.message ?? 'No se pudo iniciar sesión.');
      return null;
    }

    if (!data?.user) {
      message.error('No se pudo iniciar el registro.');
      return null;
    }

    const { data: company } = await supabase
      .from('companies')
      .insert({ email: profile.email, phone: profile.phone } as Company)
      .select()
      .single();
    await dispatch(appActions.setCompany(company));

    const { data: onboarding } = await supabase
      .from('onboarding')
      .insert({ company_id: company.company_id, status_id: STATUS_DATA.PENDING.id, step: 1 })
      .select()
      .single();

    const { data: newProfile } = await supabaseAdmin
      .from('profiles')
      .update({ company_id: company.company_id, is_default: true })
      .eq('profile_id', data.user.id)
      .select()
      .single();

    await dispatch(appActions.setOnboarding(onboarding));
    await dispatch(
      userActions.setUserAuth({
        profile: newProfile,
        authenticated: true,
        isAdmin: true,
      }),
    );
  },
};

export default customActions;
