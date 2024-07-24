import { supabase } from '@/config/supabase';
import { message } from 'antd';
import { branchesActions } from '.';
import { Branch, CashRegister, Price } from './type';
import { AppDispatch, AppState } from '@/redux/store';

export const customActions = {
  upsertBranch: (branch: Partial<Branch>) => async (dispatch: AppDispatch, getState: AppState) => {
    const company_id = getState()?.app?.company?.company_id;
    const { error } = await supabase
      .from('branches')
      .upsert({ ...branch, company_id })
      .select();

    if (error) {
      message.error('Error al guardar los datos');
      return;
    }

    await dispatch(branchesActions.getBranches());
    message.success('Datos guardados correctamente');
  },
  getBranches: (companyId?: string) => async (dispatch: AppDispatch, getState: AppState) => {
    const company_id = companyId || getState()?.app?.company?.company_id;
    const { data, error } = await supabase
      .from('branches')
      .select('*')
      .order('created_at', { ascending: true })
      .eq('company_id', company_id);

    if (error) {
      message.error('Error al obtener los datos');
      return;
    }

    dispatch(branchesActions.setBranches(data));
    dispatch(branchesActions.setCurrentBranch(data?.find(branch => branch.main_branch) || data[0]));
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
  getPrices: () => async (dispatch: AppDispatch, getState: AppState) => {
    const company_id = getState()?.app?.company?.company_id;
    const { data, error } = await supabase
      .from('prices_list')
      .select('*')
      .order('created_at', { ascending: true })
      .eq('company_id', company_id);

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
  getCashRegistersByCompanyId: () => async (dispatch: AppDispatch, getState: AppState) => {
    const company_id = getState().app.company.company_id;
    const { data, error } = await supabase
      .from('cash_registers')
      .select('*')
      .eq('company_id', company_id)
      .order('created_at', { ascending: true });

    if (error) {
      message.error('Error al obtener los datos');
      return;
    }

    dispatch(branchesActions.setCashRegisters(data));
  },
  upsertCashRegister: (cash_register: Partial<CashRegister>) => async (dispatch: AppDispatch, getState: AppState) => {
    const { company_id } = getState().app.company;

    const { error } = await supabase
      .from('cash_registers')
      .upsert({
        ...cash_register,
        company_id,
      })
      .select();

    if (error) {
      message.error('Error al guardar los datos');
      return;
    }

    await dispatch(branchesActions.getCashRegistersByCompanyId());
    message.success('Datos guardados correctamente');
  },
  deleteCashRegister: (cash_register_id: string) => async (dispatch: AppDispatch) => {
    const { error } = await supabase.from('cash_registers').delete().eq('cash_register_id', cash_register_id);

    if (error) {
      message.error('Error al eliminar');
      return;
    }

    await dispatch(branchesActions.getCashRegistersByCompanyId());
    message.info('Caja eliminada');
  },
};
