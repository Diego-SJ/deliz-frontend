import { supabase } from '@/config/supabase';
import { AppDispatch, AppState } from '@/redux/store';
import { UploadFile } from 'antd/es/upload';
import { appActions } from '.';
import { message } from 'antd';
import { Company, Onboarding } from './types';
import { BUCKETS } from '@/constants/buckets';
import { userActions } from '../users';
import { DB_ERRORS } from '@/constants/db-errors';
import { branchesActions } from '../branches';
import { STATUS_DATA } from '@/constants/status';

const customActions = {
  company: {
    getCompany:
      (id?: string) => async (dispatch: AppDispatch, getState: AppState) => {
        const company_id =
          id || getState().users?.user_auth?.profile?.company_id;

        if (!company_id) {
          dispatch(userActions.signOut());
          message.error('No se encontró la empresa');
          return;
        }

        const { data, error } = await supabase
          .from('companies')
          .select()
          .eq('company_id', company_id)
          .single();

        if (error) {
          if (error?.details === 'The result contains 0 rows') {
            message.error('No se encontró la empresa');
            dispatch(userActions.signOut());
            return;
          }
          message.error('Error al obtener los datos');
          return;
        }
        await dispatch(appActions.setCompany(data));
      },
    saveLogo:
      (file: UploadFile) =>
      async (dispatch: AppDispatch, getState: AppState) => {
        if (!!file?.originFileObj?.size) {
          const company_id = getState().app.company?.company_id;
          const fileName = company_id;
          const { data, error } = await supabase.storage
            .from('deliz')
            .upload(`company/${fileName}`, file!.originFileObj!, {
              upsert: true,
            });

          if (error) {
            message.error('Error al subir la imagen');
            return;
          }

          await dispatch(
            appActions.company.upsertBusiness({
              company_id,
              logo_url: BUCKETS.COMPANY.LOGO`${data?.fullPath}`,
            }),
          );
        }
      },
    deleteLogo: () => async (dispatch: AppDispatch, getState: AppState) => {
      const company_id = getState().app.company?.company_id;
      const { error } = await supabase.storage
        .from('deliz')
        .remove([`company/${company_id}`]);
      if (error) {
        message.error('Error al eliminar la imagen');
        return;
      }
      await dispatch(
        appActions.company.upsertBusiness({ company_id, logo_url: null }),
      );
      message.success('Imagen eliminada correctamente');
    },
    upsertBusiness:
      (company: Partial<Company>) =>
      async (dispatch: AppDispatch, getState: AppState) => {
        const oldData = getState().app.company;
        const { data, error } = await supabase
          .from('companies')
          .upsert(company)
          .select();
        if (error) {
          message.error('Error al guardar los datos');
          return;
        }
        await dispatch(appActions.setCompany({ ...oldData, ...data[0] }));
        message.success('Datos guardados correctamente');
      },
  },
  updateOnboarding:
    (onboarding: Partial<Onboarding>) =>
    async (dispatch: AppDispatch, getState: AppState) => {
      const company_id = getState().users?.user_auth?.profile?.company_id;
      const { data: oldOnboarding } = await supabase
        .from('onboarding')
        .select()
        .eq('company_id', company_id)
        .single();

      if (oldOnboarding?.status_id === STATUS_DATA.COMPLETED.id) {
        dispatch(appActions.finishOnboarding());
        return null;
      }

      const oldData = getState().app.onboarding;
      dispatch(appActions.setLoading(true));
      const { data, error } = await supabase
        .from('onboarding')
        .update(onboarding)
        .eq('company_id', oldData.company_id)
        .select()
        .single();
      dispatch(appActions.setLoading(false));
      if (error) {
        message.error('Error al guardar los datos');
        return;
      }

      await dispatch(appActions.setOnboarding({ ...oldData, ...data }));
    },
  fetchOnboarding: () => async (dispatch: AppDispatch, getState: AppState) => {
    const company_id = getState().app.company.company_id;
    const { data, error } = await supabase
      .from('onboarding')
      .select()
      .eq('company_id', company_id)
      .single();
    if (error) {
      if (error?.details === DB_ERRORS.ZERO_RECORDS) {
        dispatch(userActions.signOut());
        return;
      }
      message.error('Error al obtener los datos');
      return;
    }
    await dispatch(appActions.setOnboarding(data));
  },
  finishOnboarding: () => async (dispatch: AppDispatch, getState: AppState) => {
    dispatch(appActions.setLoading(true));
    const { profile_id } = getState().users?.user_auth?.profile!;
    const { company_id } = getState().app.company;

    const { data: onboarding, error: onboardingError } = await supabase
      .from('onboarding')
      .select()
      .eq('company_id', company_id)
      .single();

    if (onboardingError) {
      message.error('Error al finalizar el proceso');
      return false;
    }

    if (onboarding?.status_id !== STATUS_DATA.COMPLETED.id) {
      const { data, error } = await supabase.rpc('create_initial_records', {
        p_company_id: company_id,
        p_profile_id: profile_id,
      });

      if (error || !data) {
        dispatch(appActions.setLoading(false));
        message.error('Error al finalizar el proceso');
        return false;
      }
    }

    await dispatch(userActions.fetchProfile(profile_id!));

    const branches = await dispatch(branchesActions.getBranches());
    const branch = branches?.find((item) => item.main_branch);
    dispatch(branchesActions.setCurrentBranch(branch));

    await Promise.all([
      await dispatch(branchesActions.getCashRegistersByCompanyId()),
      await dispatch(branchesActions.getCurrentCashRegister()),
    ]);

    await dispatch(appActions.fetchOnboarding());
    dispatch(appActions.setLoading(false));

    message.success('Bienvenido');
  },
  tours: {
    finishTour: () => async (dispatch: AppDispatch, getState: AppState) => {
      const profile_id = getState().users?.user_auth?.profile?.profile_id;

      const { error } = await supabase
        .from('profiles')
        .update({ tours: { dashboard: true } })
        .eq('profile_id', profile_id)
        .select();

      if (error) {
        message.error('Error al finalizar el tour');
        return;
      }
      dispatch(appActions.setTourState({ run: false }));
      await dispatch(userActions.fetchProfile(profile_id!));
    },
  },
};

export default customActions;
