import { AppDispatch, AppState } from '@/redux/store';
import { supabase } from '@/config/supabase';
import { message } from 'antd';
import { FetchFunction } from '../products/actions';
import { cashiersActions } from '.';
import { CashOperation, OperationItem } from './types';
import { salesActions } from '../sales';
import { Sale, SaleDetails } from '../sales/types';

const customActions = {
  cash_operations: {
    get: (args: FetchFunction) => async (dispatch: AppDispatch, getState: AppState) => {
      try {
        let cash_operations = getState()?.cashiers?.cash_operations;
        let activeCashier = getState()?.sales?.cashiers?.activeCashier;

        if (!!cash_operations?.data?.length && !args?.refetch) return true;

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
        let operations: OperationItem[] = data?.map(
          item =>
            ({
              key: item.cash_operation_id,
              name: item.name,
              amount: item.amount,
              operation_type: item.operation_type,
              payment_method: item.payment_method,
              created_at: item.created_at,
              cashier_id: item.cashier_id,
              user_id: item.user_id,
            } as OperationItem),
        );

        let sales: OperationItem[] = sales_by_cashier?.map(
          (item: SaleDetails) =>
            ({
              key: item.sale_id?.toString(),
              name: item.customers?.name || 'Venta',
              amount: item.total || 0,
              operation_type: 'SALE',
              payment_method: item.payment_method,
              created_at: item.created_at,
              cashier_id: item.cashier_id as number,
              user_id: '',
            } as OperationItem),
        );

        operations = [...operations, ...sales].sort(
          (a, b) => Number(new Date(b?.created_at || '')) - Number(new Date(a?.created_at || '')),
        );

        let amounts = {
          initial_amount: activeCashier?.initial_amount,
          sales_amount,
          incomes_amount,
          expenses_amount,
          total_amount,
          operations,
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
};

export default customActions;
