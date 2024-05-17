import { AppDispatch, AppState } from '@/redux/store';
import { supabase } from '@/config/supabase';
import { message } from 'antd';
import { FetchFunction } from '../products/actions';
import { cashiersActions } from '.';
import { CashOperation, OperationItem } from './types';
import { salesActions } from '../sales';
import { Cashier, Sale, SaleDetails } from '../sales/types';
import { cashierHelpers } from '@/utils/cashiers';

const customActions = {
  cash_operations: {
    get: (args: FetchFunction) => async (dispatch: AppDispatch, getState: AppState) => {
      try {
        let cash_operations = getState()?.cashiers?.cash_operations;
        let activeCashier = getState()?.sales?.cashiers?.activeCashier;

        if (!!cash_operations?.data?.length && !args?.refetch) return true;
        if (!activeCashier?.cashier_id) return true;

        dispatch(cashiersActions.setLoading(true));
        let { data: result, error } = await supabase
          .from('cash_operations')
          .select('*')
          .eq('cashier_id', activeCashier?.cashier_id); //.range(0, 9);
        dispatch(cashiersActions.setLoading(false));

        if (error) {
          message.error('No se pudo cargar esta información', 4);
          return false;
        }

        let data = result?.map(item => ({ ...item, key: item.cash_operation_id as string } as CashOperation)) ?? [];
        data = data?.sort((a, b) => Number(new Date(b?.created_at || '')) - Number(new Date(a?.created_at || '')));

        dispatch(cashiersActions.setCashOperations({ data }));
        return true;
      } catch (error) {
        dispatch(cashiersActions.setLoading(false));
        return false;
      }
    },
    getSalesByCashier: (args: FetchFunction) => async (dispatch: AppDispatch, getState: AppState) => {
      try {
        let sales_by_cashier = getState()?.cashiers?.cash_operations?.sales_by_cashier;
        let activeCashier = getState()?.sales?.cashiers?.activeCashier;

        if (!!sales_by_cashier?.length && !args?.refetch) return true;

        if (!activeCashier?.cashier_id) return false;

        dispatch(cashiersActions.setLoading(true));
        let { data: result, error } = await supabase
          .from('sales')
          .select(
            `
        *,
        customers ( name ),
        status ( status_id, name )
      `,
          )
          .eq('cashier_id', activeCashier?.cashier_id)
          .eq('status_id', 4); //.range(0, 9);
        dispatch(cashiersActions.setLoading(false));

        if (error) {
          message.error('No se pudo cargar esta información', 4);
          return false;
        }

        let data = result?.map(item => ({ ...item, key: item.sale_id as number } as SaleDetails)) ?? [];
        data = data?.sort((a, b) => Number(new Date(b?.created_at || '')) - Number(new Date(a?.created_at || '')));

        dispatch(cashiersActions.setCashOperations({ sales_by_cashier: data }));
        return true;
      } catch (error) {
        dispatch(cashiersActions.setLoading(false));
        return false;
      }
    },
    calculateCashierData: () => async (dispatch: AppDispatch, getState: AppState) => {
      try {
        let activeCashier = getState()?.sales?.cashiers?.activeCashier;
        let { data = [], sales_by_cashier = [] } = getState()?.cashiers?.cash_operations;

        let sales_amount = sales_by_cashier?.reduce((acc, item) => acc + (item?.total || 0), 0);
        let incomes_amount = data
          ?.filter(item => item?.operation_type === 'INCOME')
          ?.reduce((acc, item) => acc + item?.amount, 0);
        let expenses_amount = data
          ?.filter(item => item?.operation_type === 'EXPENSE')
          ?.reduce((acc, item) => acc + item?.amount, 0);
        let total_amount = (activeCashier?.initial_amount || 0) + sales_amount + incomes_amount - expenses_amount;

        let amounts = {
          initial_amount: activeCashier?.initial_amount,
          sales_amount,
          incomes_amount,
          expenses_amount,
          total_amount,
          operations: cashierHelpers.calculateAmounts(data, sales_by_cashier),
        };

        dispatch(cashiersActions.setCashOperations(amounts));
      } catch (error) {
        dispatch(cashiersActions.setLoading(false));
        return false;
      }
    },
    add: (expense: Partial<CashOperation>) => async (dispatch: AppDispatch, getState: AppState) => {
      try {
        let activeCashier = getState()?.sales?.cashiers?.activeCashier;

        dispatch(cashiersActions.setLoading(true));
        const { error } = await supabase
          .from('cash_operations')
          .insert([
            {
              name: expense.name || '',
              operation_type: expense.operation_type,
              amount: expense.amount || 0,
              cashier_id: activeCashier?.cashier_id,
              payment_method: expense.payment_method,
            },
          ])
          .select();
        dispatch(cashiersActions.setLoading(false));

        if (error) {
          message.error('No se pudo guardar el registro.', 4);
          return false;
        }

        await dispatch(cashiersActions.cash_operations.get({ refetch: true }));
        await dispatch(cashiersActions.cash_operations.calculateCashierData());
        message.success('Registro agregado', 4);
        return true;
      } catch (error) {
        dispatch(cashiersActions.setLoading(false));
        return false;
      }
    },
    delete: (cash_operation_id: number) => async (dispatch: AppDispatch) => {
      try {
        dispatch(cashiersActions.setLoading(true));
        const { error } = await supabase.from('cash_operations').delete().eq('cash_operation_id', cash_operation_id);
        dispatch(cashiersActions.setLoading(false));

        if (error) {
          message.error(`No se pudo eliminar este elemento: ${error.message}`);
          return false;
        }

        dispatch(cashiersActions.cash_operations.get({ refetch: true }));
        message.success('Elemento eliminado');
      } catch (error) {
        message.error('No se pudo eliminar este elemento');
        dispatch(salesActions.setLoading(false));
        return false;
      }
    },
  },
  cashier_detail: {
    set: (cashier: Cashier) => async (dispatch: AppDispatch) => {
      dispatch(cashiersActions.setCashierDetail({ data: cashier }));
    },
    getCashierOperationsById: (cashier_id: number) => async (dispatch: AppDispatch, getState: AppState) => {
      try {
        if (!cashier_id) return false;

        dispatch(cashiersActions.setLoading(true));
        let { data: operations, error: operationsError } = await supabase
          .from('cash_operations')
          .select('*')
          .eq('cashier_id', cashier_id);

        let { data: sales, error: salesOperation } = await supabase
          .from('sales')
          .select(
            `
        *,
        customers ( name ),
        status ( status_id, name )
      `,
          )
          .eq('cashier_id', cashier_id)
          .eq('status_id', 4);

        dispatch(cashiersActions.setLoading(false));

        if (operationsError || salesOperation) {
          message.error('No se pudo cargar esta información', 4);
          return false;
        }

        let data = cashierHelpers.calculateAmounts(operations as CashOperation[], sales as SaleDetails[]);

        dispatch(cashiersActions.setCashierDetail({ operations: data }));
        return true;
      } catch (error) {
        dispatch(cashiersActions.setLoading(false));
        return false;
      }
    },
  },
};

export default customActions;
