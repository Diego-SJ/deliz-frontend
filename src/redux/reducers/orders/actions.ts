import { AppDispatch, AppState } from '@/redux/store';
import { orderActions } from '.';
import { supabase } from '@/config/supabase';
import { STATUS_DATA } from '@/constants/status';
import { message } from 'antd';
import { Order } from './types';
import dayjs, { Dayjs } from 'dayjs';

export const orderCustomActions = {
  fetchOrdersAndPendings: (date?: Dayjs) => async (dispatch: AppDispatch, getState: AppState) => {
    const company_id = getState().app.company.company_id;
    const startOfMonth =
      dayjs(date || undefined)
        .startOf('month')
        .toISOString()
        .slice(0, 8) + '01';
    const endOfMonth = dayjs(date || undefined)
      .endOf('month')
      .toISOString()
      .slice(0, 10);
    dispatch(orderActions.setLoading(true));

    const supabaseQuery = supabase
      .from('sales')
      .select(`order_due_date, created_at, customers ( name ), status ( status_id, name )`)
      .in('status_id', [STATUS_DATA.PENDING.id, STATUS_DATA.ORDER.id])
      .eq('company_id', company_id)
      .or(`created_at.gte.${startOfMonth},order_due_date.gte.${startOfMonth}`)
      .or(`created_at.lt.${endOfMonth},order_due_date.lt.${endOfMonth}`)
      .order('created_at', { ascending: false });

    const { data, error } = await supabaseQuery;

    dispatch(orderActions.setLoading(false));

    if (error) {
      message.error('No se pudo cargar la lista de pedidos');
      return false;
    }

    dispatch(orderActions.setOrders(data as unknown as Order[]));
    return true;
  },
};
