import { AppDispatch, AppState } from '@/redux/store';
import { analyticsActions, initialData } from '.';
import { supabase } from '@/config/supabase';
import dayjs from 'dayjs';
import { STATUS_DATA } from '@/constants/status';
import { message } from 'antd';
import { LineChartDataItem } from './types';
import functions from '@/utils/functions';

export const analyticsCustomActions = {
  getSales: () => async (dispatch: AppDispatch, getState: AppState) => {
    dispatch(analyticsActions.setSales({ loading: true }));
    const { company } = getState().app;

    const { data, error } = await supabase
      .from('sales')
      .select('sale_id, created_at, total')
      .eq('company_id', company.company_id)
      .gte('created_at', dayjs().subtract(7, 'days').toISOString())
      .order('created_at', { ascending: true })
      .eq('status_id', STATUS_DATA.PAID.id);

    if (error) {
      dispatch(analyticsActions.setSales({ loading: false }));
      message.error(error.message);
      return;
    }

    dispatch(analyticsActions.setSales({ total: data.length }));

    const salesData: LineChartDataItem[] = data.map(sale => ({
      x: functions.formatToLocal(sale.created_at).format('D MMM'),
      y: 1,
      total: sale.total,
    }));

    const groupedSales = initialData[0].data.map(day => {
      const salesForDay = salesData.filter(sale => sale.x === day.x);
      return {
        ...day,
        y: salesForDay.reduce((sum, sale) => sum + sale.y, day.y),
        total: salesForDay.reduce((sum, sale) => sum + sale.total, day.total),
      };
    });

    dispatch(analyticsActions.setSales({ data: [{ id: 'sales_report', data: groupedSales }], loading: false }));
  },
  getTopProducts: () => async (dispatch: AppDispatch, getState: AppState) => {
    const company_id = getState().app.company.company_id;
    dispatch(analyticsActions.setProducts({ loading: true }));

    let { data, error } = await supabase.rpc('get_top_selling_products', {
      company_uuid: company_id,
      limit_num: 10,
      order_direction: 'desc',
      end_date: null,
      start_date: null,
    });

    if (error) {
      dispatch(analyticsActions.setProducts({ loading: false }));
      message.error(error.message);
      return;
    }

    dispatch(analyticsActions.setProducts({ top_products: data, loading: false }));
  },
  getTopCustomers: () => async (dispatch: AppDispatch, getState: AppState) => {
    const company_id = getState().app.company.company_id;
    dispatch(analyticsActions.setCustomers({ loading: true }));
    let { data, error } = await supabase.rpc('get_top_customers', {
      company_uuid: company_id,
      limit_num: 10,
      order_direction: 'desc',
      end_date: null,
      start_date: null,
    });

    if (error) {
      dispatch(analyticsActions.setCustomers({ loading: false }));
      message.error(error.message);
      return;
    }

    dispatch(analyticsActions.setCustomers({ top_customers: data, loading: false }));
  },
};
