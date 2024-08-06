import { AppDispatch, AppState } from '@/redux/store';
import { FetchOperationsFilters, OperatingCost } from './types';
import { supabase } from '@/config/supabase';
import { message } from 'antd';
import { operatingCostsActions } from '.';
import functions from '@/utils/functions';

export const customOperatingCostsActions = {
  upsertOperation: (operation: Partial<OperatingCost>) => async (_: AppDispatch, getState: AppState) => {
    const state = getState();

    const newOperation = {
      ...operation,
      company_id: state.app.company.company_id || null,
      branch_id: state.branches.currentBranch?.branch_id || null,
      cash_register_id: state.branches.currentCashRegister?.cash_register_id || null,
    };

    const supabaseQuery = supabase;

    const { data, error } = await supabaseQuery.from('operating_costs').upsert(newOperation).select().single();

    if (error) {
      message.error('Error al guardar la operación');
      return false;
    }

    message.success(`Información ${operation?.operating_cost_id ? 'actualizada' : 'guardada'} correctamente`);
    return data;
  },
  fetchOperations: () => async (dispatch: AppDispatch, getState: AppState) => {
    const { filters } = getState().operatingCosts;
    const { company_id } = getState().app.company;
    dispatch(operatingCostsActions.setLoading(true));

    const supabaseQuery = supabase.from('operating_costs').select('*, status(*)').eq('company_id', company_id);

    if (filters.status_id && filters.status_id !== 0) {
      supabaseQuery.eq('status_id', filters.status_id);
    }

    if (filters.branch_id && filters.branch_id !== 'ALL') {
      supabaseQuery.eq('branch_id', filters.branch_id);
    }

    const { data, error } = await supabaseQuery;
    dispatch(operatingCostsActions.setLoading(false));

    if (error) {
      message.error('Error al obtener las operaciones');
      return null;
    }

    dispatch(operatingCostsActions.setOperatingCosts(data));
    return data;
  },
  getOperationById: (operation_id: string) => async (dispatch: AppDispatch, __: AppState) => {
    dispatch(operatingCostsActions.setLoading(true));
    const { data, error } = await supabase
      .from('operating_costs')
      .select('*, status(*)')
      .eq('operating_cost_id', operation_id)
      .single();
    dispatch(operatingCostsActions.setLoading(false));
    if (error) {
      message.error('Error al obtener la operación');
      return null;
    }

    return data;
  },
  filterBySearch: (search_text: string) => async (dispatch: AppDispatch, getState: AppState) => {
    const state = getState().operatingCosts?.operatingCosts || [];

    if (!search_text) {
      return state;
    }

    const filtered = state.filter(operation => {
      return functions.includes(operation?.reason, search_text) || functions.includes(operation?.notes, search_text);
    });

    return filtered;
  },
  deleteOperation: (operation_id: string) => async (_: AppDispatch, getState: AppState) => {
    const { company_id } = getState().app.company;
    const { error } = await supabase
      .from('operating_costs')
      .delete()
      .eq('operating_cost_id', operation_id)
      .eq('company_id', company_id);

    if (error) {
      message.error('Error al eliminar la operación');
      return null;
    }

    message.success('Operación eliminada correctamente');
    return true;
  },
};
