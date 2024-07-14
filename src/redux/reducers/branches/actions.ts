import { supabase } from '@/config/supabase';
import { message } from 'antd';
import { branchesActions } from '.';
import { Branch, Price } from './type';
import { AppDispatch } from '@/redux/store';

export const customActions = {
  upsertBranch: (branch: Partial<Branch>) => async (dispatch: AppDispatch) => {
    const { error } = await supabase.from('branches').upsert(branch).select();

    if (error) {
      message.error('Error al guardar los datos');
      return;
    }

    await dispatch(branchesActions.getBranches());
    message.success('Datos guardados correctamente');
  },
  getBranches: () => async (dispatch: AppDispatch) => {
    const { data, error } = await supabase.from('branches').select('*').order('created_at', { ascending: true });

    if (error) {
      message.error('Error al obtener los datos');
      return;
    }

    dispatch(branchesActions.setBranches(data));
  },
  getBranchById: (branch_id: string) => async (dispatch: AppDispatch) => {
    const { data, error } = await supabase.from('branches').select('*').eq('branch_id', branch_id).single();

    if (error) {
      message.error('Error al obtener los datos');
      return;
    }

    return data;
  },
  deleteBranch: (branch_id: string) => async (dispatch: AppDispatch) => {
    const { error } = await supabase.from('branches').delete().eq('branch_id', branch_id);

    if (error) {
      message.error('Error al eliminar');
      return;
    }

    await dispatch(branchesActions.getBranches());
    message.info('Sucursal eliminada');
  },
  upsertPrice: (price: Partial<Price>) => async (dispatch: AppDispatch) => {
    const { error } = await supabase.from('prices_list').upsert(price).select();

    if (error) {
      message.error('Error al guardar los datos');
      return;
    }

    await dispatch(branchesActions.getPrices());
    message.success('Datos guardados correctamente');
  },
  getPrices: () => async (dispatch: AppDispatch) => {
    const { data, error } = await supabase.from('prices_list').select('*').order('created_at', { ascending: true });

    if (error) {
      message.error('Error al obtener los datos');
      return;
    }

    dispatch(branchesActions.setPricesList(data));
  },
  getPriceById: (price_id: string) => async (dispatch: AppDispatch) => {
    const { data, error } = await supabase.from('prices_list').select('*').eq('price_id', price_id).single();

    if (error) {
      message.error('Error al obtener los datos');
      return;
    }

    return data;
  },
  deletePrice: (price_id: string) => async (dispatch: AppDispatch) => {
    const { error } = await supabase.from('prices_list').delete().eq('price_id', price_id);

    if (error) {
      message.error('Error al eliminar');
      return;
    }

    await dispatch(branchesActions.getPrices());
    message.info('Precio eliminado');
  },
};
