import { AppDispatch, AppState } from '@/redux/store';
import { supabase } from '@/config/supabase';
import { message } from 'antd';
import { FetchFunction } from '../products/actions';
import { cashiersActions } from '.';
import {
  CashCut,
  CashOperation,
  FetchCashCutArgs,
  MoveSalePayload,
} from './types';
import { salesActions } from '../sales';
import { Cashier, SaleDetails } from '../sales/types';
import { STATUS_DATA } from '@/constants/status';
import { userActions } from '../users';
import { branchesActions } from '../branches';
import { productActions } from '../products';

const customActions = {
  fetchDataForCashRegister:
    () => async (dispatch: AppDispatch, getState: AppState) => {
      const company_id = getState().users?.user_auth?.profile?.company_id;
      const branch_id = getState().branches?.currentBranch?.branch_id;
      const cash_register_id =
        getState()?.branches?.currentCashRegister?.cash_register_id;
      const user = getState().users?.user_auth;

      if (!company_id) {
        message.error(
          'Tu cuenta no existe o no tiene permisos para acceder a esta información',
          4,
        );
        dispatch(userActions.signOut());
        return;
      }

      let supabasePriceList = supabase
        .from('prices_list')
        .select('*')
        .order('created_at', { ascending: true })
        .eq('company_id', company_id);

      if (!user?.isAdmin) {
        supabasePriceList.in('price_id', user?.profile?.price_list || []);
      }

      const [products, cashRegister, currentCashCut, priceList] =
        await Promise.all([
          supabase
            .from('products')
            .select(`*, categories(category_id,name)`)
            .eq('company_id', company_id)
            .order('name', { ascending: true }),
          supabase
            .from('cash_registers')
            .select('*')
            .eq('is_default', true)
            .eq('branch_id', branch_id)
            .single(),
          supabase
            .from('cash_cuts')
            .select('*')
            .eq('cash_register_id', cash_register_id)
            .eq('branch_id', branch_id)
            .eq('is_open', true)
            .single(),
          supabasePriceList,
        ]);

      dispatch(productActions.setProducts(products?.data || []));
      dispatch(
        branchesActions.setCurrentCashRegister(cashRegister?.data || []),
      );
      dispatch(cashiersActions.setActiveCashCut(currentCashCut?.data || null));
      dispatch(branchesActions.setPricesList(priceList?.data || []));
    },
  cash_operations: {
    get: () => async (dispatch: AppDispatch, getState: AppState) => {
      try {
        let activeCashier = getState()?.sales?.cashiers?.activeCashier;
        if (!activeCashier?.cashier_id) return true;

        dispatch(cashiersActions.setLoading(true));

        let { data: result, error } = await supabase
          .from('cash_operations')
          .select('*')
          .eq('cashier_id', activeCashier?.cashier_id)
          .order('created_at', { ascending: false });

        dispatch(cashiersActions.setLoading(false));

        if (error) {
          message.error('No se pudo cargar esta información', 4);
          return false;
        }

        let data =
          result?.map(
            (item) =>
              ({
                ...item,
                key: item.cash_operation_id as string,
              }) as CashOperation,
          ) ?? [];

        dispatch(cashiersActions.setCashOperations({ data }));
        return true;
      } catch (error) {
        dispatch(cashiersActions.setLoading(false));
        return false;
      }
    },
    getSalesByCashier:
      (_?: FetchFunction) =>
      async (dispatch: AppDispatch, getState: AppState) => {
        try {
          let activeCashier = getState()?.sales?.cashiers?.activeCashier;
          if (!activeCashier?.cashier_id) return false;

          dispatch(cashiersActions.setLoading(true));

          let { data: result, error } = await supabase
            .from('sales')
            .select(`*, customers ( name ), status ( status_id, name )`)
            .eq('cashier_id', activeCashier?.cashier_id)
            .order('created_at', { ascending: false });

          dispatch(cashiersActions.setLoading(false));

          if (error) {
            message.error('No se pudo cargar esta información', 4);
            return false;
          }

          let data =
            result?.map(
              (item) =>
                ({ ...item, key: item.sale_id as number }) as SaleDetails,
            ) ?? [];

          dispatch(
            cashiersActions.setCashOperations({ sales_by_cashier: data }),
          );
          return true;
        } catch (error) {
          dispatch(cashiersActions.setLoading(false));
          return false;
        }
      },
    add:
      (expense: Partial<CashOperation>) =>
      async (dispatch: AppDispatch, getState: AppState) => {
        let activeCashCut = getState()?.cashiers?.active_cash_cut;

        dispatch(cashiersActions.setLoading(true));
        const { error } = await supabase
          .from('cash_operations')
          .insert([
            {
              name: expense.name || '',
              operation_type: expense.operation_type,
              amount: expense.amount || 0,
              payment_method: expense.payment_method,
              cash_register_id: activeCashCut?.cash_register_id,
              branch_id: activeCashCut?.branch_id,
              cash_cut_id: activeCashCut?.cash_cut_id,
            },
          ])
          .select()
          .single();
        dispatch(cashiersActions.setLoading(false));

        if (error) {
          message.error('No se pudo guardar el registro.', 4);
          return false;
        }

        await dispatch(cashiersActions.cash_cuts.fetchCashCutData());
        message.success('Registro agregado', 4);
        return true;
      },
    delete: (cash_operation_id: number) => async (dispatch: AppDispatch) => {
      try {
        dispatch(cashiersActions.setLoading(true));
        const { error } = await supabase
          .from('cash_operations')
          .delete()
          .eq('cash_operation_id', cash_operation_id);
        dispatch(cashiersActions.setLoading(false));

        if (error) {
          message.error(`No se pudo eliminar este elemento: ${error.message}`);
          return false;
        }

        dispatch(cashiersActions.cash_operations.get());
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
  },
  cash_cuts: {
    openCashCut:
      (cashCut: Partial<CashCut>) =>
      async (dispatch: AppDispatch, getState: AppState) => {
        const cash_register_id =
          getState()?.branches?.currentCashRegister?.cash_register_id;
        const branch_id = getState()?.branches?.currentBranch?.branch_id;
        const company_id = getState()?.app?.company?.company_id;
        let cashCutOpened: CashCut | null = null;

        const { data: cashCutVerification, error: cashCutError } =
          await supabase
            .from('cash_cuts')
            .select('*')
            .eq('cash_register_id', cash_register_id)
            .eq('branch_id', branch_id)
            .eq('company_id', company_id)
            .eq('is_open', true)
            .single();

        if (cashCutVerification && !cashCutError) {
          cashCutOpened = cashCutVerification as CashCut;
        } else {
          const { data, error } = await supabase
            .from('cash_cuts')
            .insert([
              {
                ...cashCut,
                is_open: true,
                branch_id,
                cash_register_id,
                company_id,
              },
            ])
            .select()
            .single();

          if (error) {
            message.error('No se pudo abrir la caja');
            return false;
          }

          cashCutOpened = data as CashCut;
        }

        dispatch(cashiersActions.setActiveCashCut(cashCutOpened as CashCut));
        message.success('Caja abierta');
        return true;
      },
    fetchCashCutOpened:
      (args?: { fetchCashCutOperations?: boolean }) =>
      async (dispatch: AppDispatch, getState: AppState) => {
        const branch_id = getState()?.branches?.currentBranch?.branch_id || '';
        const cash_register_id =
          getState()?.branches?.currentCashRegister?.cash_register_id || '';

        const { data, error } = await supabase
          .from('cash_cuts')
          .select('*')
          .eq('cash_register_id', cash_register_id)
          .eq('is_open', true)
          .single();

        if (error) {
          dispatch(
            cashiersActions.setActiveCashCut({
              branch_id,
              cash_register_id,
              cash_cut_id: null,
              notes: '',
              is_open: false,
              opening_date: '',
              closing_date: null,
              initial_amount: 0,
              sales_amount: 0,
              incomes_amount: 0,
              expenses_amount: 0,
              final_amount: 0,
              received_amount: 0,
              operations: [],
            }),
          );
          return false;
        }

        await dispatch(cashiersActions.setActiveCashCut(data as CashCut));
        if (args?.fetchCashCutOperations) {
          await dispatch(cashiersActions.cash_cuts.fetchCashCutData());
        }
        return data;
      },
    fetchCashCutData:
      (args?: FetchCashCutArgs) =>
      async (dispatch: AppDispatch, getState: AppState) => {
        const { cashCut } = args || {};
        const state = getState();
        const cash_register_id =
          state?.branches?.currentCashRegister?.cash_register_id;
        const currentCashCut = state?.cashiers?.active_cash_cut;
        let cashCutData = cashCut || currentCashCut;

        if (!cash_register_id || !cashCutData?.cash_cut_id) {
          return false;
        }

        // Fetch data in parallel
        const [salesData, operationsData] = await Promise.all([
          supabase
            .from('sales')
            .select(
              'sale_id, total, customers ( name ), created_at, payment_method, branch_id',
            )
            .eq('cash_cut_id', cashCutData?.cash_cut_id)
            .eq('status_id', STATUS_DATA.PAID.id),
          supabase
            .from('cash_operations')
            .select('*')
            .eq('cash_cut_id', cashCutData?.cash_cut_id),
        ]);

        // Extract data and error
        const { data: sales } = salesData;
        const { data: operations } = operationsData;

        // Combine operations with sales
        let combinedOperations: CashOperation[] = [];
        let incomes_amount = 0;
        let expenses_amount = 0;

        if (operations) {
          combinedOperations = [
            ...operations.map((item: any) => {
              if (item.operation_type === 'INCOME')
                incomes_amount += item.amount;
              if (item.operation_type === 'EXPENSE')
                expenses_amount += item.amount;
              return {
                ...item,
                cash_operation_id: item.cash_operation_id.toString(),
              } as CashOperation;
            }),
          ];
        }

        let sales_amount = 0;
        if (sales) {
          combinedOperations = [
            ...combinedOperations,
            ...sales.map((item: any) => {
              sales_amount += item.total;
              return {
                cash_operation_id: item?.sale_id?.toString() || '',
                name: `Cliente ${item?.customers?.name || 'Público general'}`,
                operation_type: 'SALE',
                amount: item.total,
                created_at: item.created_at,
                payment_method: item?.payment_method || '',
                cash_register_id: cash_register_id || '',
                branch_id: item?.branch_id || '',
              } as CashOperation;
            }),
          ];
        }

        combinedOperations?.sort(
          (a, b) =>
            new Date(b?.created_at).getTime() -
            new Date(a?.created_at).getTime(),
        );

        const final_amount =
          (cashCutData?.initial_amount || 0) +
          sales_amount +
          incomes_amount -
          expenses_amount;
        const currentCashCutData = {
          ...cashCutData,
          sales_amount,
          operations: combinedOperations,
          incomes_amount,
          expenses_amount,
          final_amount,
        } as CashCut;

        dispatch(cashiersActions.setActiveCashCut(currentCashCutData));
        return true;
      },
    fetchCashCutsByCompany:
      () => async (dispatch: AppDispatch, getState: AppState) => {
        const company_id = getState()?.app?.company?.company_id;
        const filters = getState()?.cashiers?.cash_cuts?.filters;
        dispatch(cashiersActions.setLoading(true));
        let supabaseQuery = supabase
          .from('cash_cuts')
          .select('*', { count: 'exact' })
          .eq('company_id', company_id)
          .eq('is_open', false);

        if (filters?.order_by) {
          const [field, direction] = filters?.order_by.split(',');
          supabaseQuery.order(field, { ascending: direction === 'true' });
        } else {
          supabaseQuery.order('closing_date', { ascending: false });
        }

        if (filters?.cash_register_id) {
          supabaseQuery.eq('cash_register_id', filters?.cash_register_id);
        }

        if (filters?.branch_id) {
          supabaseQuery.eq('branch_id', filters?.branch_id);
        }

        // pagination
        const page = filters?.page || 0;
        const pageSize = filters?.pageSize || 10;
        let offset = page * pageSize;
        let limit = (page + 1) * pageSize - 1;

        const {
          data,
          error: cashCutError,
          count,
        } = await supabaseQuery.range(offset, limit);
        dispatch(cashiersActions.setLoading(false));
        dispatch(
          cashiersActions.setCashCutFilters({
            total: count || 0,
            page,
            pageSize,
          }),
        );

        if (cashCutError) {
          dispatch(cashiersActions.setCashCuts([]));
          return false;
        }
        dispatch(cashiersActions.setCashCuts(data));
        return true;
      },
    fetchCashCutsByCashRegister:
      ({
        cash_register_id,
        order,
      }: {
        order: string;
        cash_register_id: string;
      }) =>
      async (dispatch: AppDispatch) => {
        let supabaseQuery = supabase
          .from('cash_cuts')
          .select('*')
          .eq('cash_register_id', cash_register_id)
          .eq('is_open', false);

        if (order) {
          const [field, direction] = order.split(',');
          supabaseQuery.order(field, { ascending: direction === 'true' });
        }

        const { data, error: cashCutError } = await supabaseQuery;

        if (cashCutError) {
          dispatch(cashiersActions.setCashCuts([]));
          return false;
        }
        dispatch(cashiersActions.setCashCuts(data));
        return true;
      },
    fetchCashCutDataById:
      (cash_cut_id: string) =>
      async (): Promise<
        (CashCut & { branches: any; cash_registers: any }) | null
      > => {
        if (!cash_cut_id) {
          message.error('No se pudo cargar la información de la caja', 4);
        }

        const { data, error: cashCutError } = await supabase
          .from('cash_cuts')
          .select('*, branches (name), cash_registers (name)')
          .eq('cash_cut_id', cash_cut_id)
          .single();

        if (cashCutError) {
          message.error('No se pudo cargar la información de la caja', 4);
          return null;
        }

        // Fetch data in parallel
        const [salesData, operationsData] = await Promise.all([
          supabase
            .from('sales')
            .select(
              'sale_id, total, customers ( name ), created_at, payment_method, branch_id',
            )
            .eq('cash_cut_id', cash_cut_id)
            .eq('status_id', STATUS_DATA.PAID.id),
          supabase
            .from('cash_operations')
            .select('*')
            .eq('cash_cut_id', cash_cut_id),
        ]);

        // Extract data and error
        const { data: sales } = salesData;
        const { data: operations } = operationsData;

        // Combine operations with sales
        let combinedOperations: CashOperation[] = [];

        if (operations) {
          combinedOperations = [
            ...operations.map((item: any) => {
              return {
                ...item,
                cash_operation_id: item.cash_operation_id.toString(),
              } as CashOperation;
            }),
          ];
        }

        if (sales) {
          combinedOperations = [
            ...combinedOperations,
            ...sales.map((item: any) => {
              return {
                cash_operation_id: item?.sale_id?.toString() || '',
                name: `Cliente ${item?.customers?.name || 'Público general'}`,
                operation_type: 'SALE',
                amount: item.total,
                created_at: item.created_at,
                payment_method: item?.payment_method || '',
                cash_register_id: data?.cash_register_id || '',
                branch_id: item?.branch_id || '',
              } as CashOperation;
            }),
          ];
        }

        combinedOperations?.sort(
          (a, b) =>
            new Date(b?.created_at).getTime() -
            new Date(a?.created_at).getTime(),
        );

        const currentCashCutData = {
          ...data,
          operations: combinedOperations,
        } as CashCut & { branches: any; cash_registers: any };

        return currentCashCutData;
      },
    makeCashCut:
      (receivedAmount: number) =>
      async (dispatch: AppDispatch, getState: AppState) => {
        dispatch(salesActions.setLoading(true));
        const state = getState();
        const company_id = state?.app?.company?.company_id;
        const branch_id = state?.branches?.currentBranch?.branch_id;
        const cash_register_id =
          state?.branches?.currentCashRegister?.cash_register_id;

        let { data, error } = await supabase.rpc('make_cash_cut', {
          p_received_amount: receivedAmount,
          p_company_id: company_id,
          p_branch_id: branch_id,
          p_cash_register_id: cash_register_id,
        });
        dispatch(salesActions.setLoading(false));

        if (error) {
          message.error('No se pudo actualizar el registro.', 4);
          return false;
        }

        dispatch(
          cashiersActions.setActiveCashCut({
            cash_register_id:
              state?.branches?.currentCashRegister?.cash_register_id || null,
            branch_id: state?.branches?.currentBranch?.branch_id || null,
            is_open: false,
            initial_amount: 0,
            sales_amount: 0,
            incomes_amount: 0,
            expenses_amount: 0,
            cash_cut_id: null,
            final_amount: 0,
            received_amount: 0,
            notes: '',
            opening_date: '',
            operations: [],
            closing_date: null,
          }),
        );
        message.success(
          data
            ? 'Corte de caja realizado'
            : 'Corte de caja realizado previamente',
          4,
        );
        return true;
      },
    moveSaleToAnotherCashCut:
      (payload: MoveSalePayload) => async (dispatch: AppDispatch) => {
        let { error } = await supabase.rpc('move_sale_to_another_cash_cut', {
          branch_id_param: payload.branch_id,
          cash_register_id_param: payload.cash_register_id,
          new_cash_cut_id: payload.new_cash_cut_id,
          old_cash_cut_id: payload.old_cash_cut_id,
          sale_id_param: payload.sale_id,
        });

        if (error) {
          return false;
        }

        await dispatch(
          salesActions.getSaleById({ sale_id: payload.sale_id, refetch: true }),
        );
        return true;
      },
  },
};

export default customActions;
