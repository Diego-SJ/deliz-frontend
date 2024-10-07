import { AppDispatch, AppState } from '@/redux/store';
import { analyticsActions, initialData } from '.';
import { supabase } from '@/config/supabase';
import dayjs from 'dayjs';
import { STATUS_DATA } from '@/constants/status';
import { message } from 'antd';
import { BarChartDataItem, LineChartData, LineChartDataItem } from './types';
import functions from '@/utils/functions';
import { getDateRange } from '@/utils/sales-report';
import { PieChartItem } from '@/types/charts';

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

    const salesData: LineChartDataItem[] = data.map((sale) => ({
      x: functions.formatToLocal(sale.created_at).format('D MMM'),
      y: 1,
      total: sale.total,
    }));

    const groupedSales = initialData[0].data.map((day) => {
      const salesForDay = salesData.filter((sale) => sale.x === day.x);
      return {
        ...day,
        y: salesForDay.reduce((sum, sale) => sum + sale.y, day.y),
        total: salesForDay.reduce((sum, sale) => sum + sale.total, day.total),
      };
    });

    dispatch(
      analyticsActions.setSales({
        data: [{ id: 'sales_report', data: groupedSales }],
        loading: false,
      }),
    );
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

    dispatch(
      analyticsActions.setProducts({ top_products: data, loading: false }),
    );
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

    dispatch(
      analyticsActions.setCustomers({ top_customers: data, loading: false }),
    );
  },
  sales: {
    getWeekReport: () => async (dispatch: AppDispatch, getState: AppState) => {
      const company_id = getState().app.company.company_id;
      let [start_date, end_date, rangeDates] = getDateRange('last_7_days');
      const { data, error } = await supabase.rpc('get_sales_by_date_range', {
        p_company_ids: [company_id],
        p_start_date: start_date,
        p_end_date: end_date,
      });

      if (error) {
        message.error(error.message);
      }

      const salesData: LineChartDataItem[] = [];
      let totalSales = 0;

      rangeDates.forEach((date) => {
        const sales = data.find((sale: any) => sale.sale_date === date);
        totalSales += sales?.total_completed_sales || 0;
        salesData.push({
          x: dayjs(date).format('D MMM'),
          y: sales?.total_completed_sales || 0,
          total: sales?.total_completed_amount || 0,
        });
      });

      dispatch(analyticsActions.setSales({ total: totalSales }));
      dispatch(
        analyticsActions.setSales({
          data: [{ id: 'sales_report', data: salesData }],
        }),
      );
    },
    getFullDataByFilters:
      () => async (dispatch: AppDispatch, getState: AppState) => {
        const filters = getState().analytics?.sales?.filters;
        const company_id = getState().app.company.company_id;
        let [start_date, end_date, rangeDates] = getDateRange(
          filters?.date_range,
          filters?.custom_dates,
        );

        dispatch(analyticsActions.setSales({ loading: true }));

        const filtersData = {
          p_company_ids: [company_id],
          p_customer_ids: filters?.customers?.length
            ? filters?.customers
            : null,
          p_branch_ids: filters?.branches?.length ? filters?.branches : null,
          p_start_date: start_date || null,
          p_end_date: end_date || null,
        };

        const [salesSummaryResponse, salesByDatesResponse] = await Promise.all([
          supabase.rpc('get_sales_summary', filtersData).single(),
          supabase.rpc('get_sales_by_date_range', filtersData),
        ]);

        const { data: salesSummary, error: error1 } = salesSummaryResponse;
        const { data: salesByDates, error: error2 } = salesByDatesResponse;

        dispatch(analyticsActions.setSales({ loading: false }));

        if (error1) {
          message.error(error1.message);
        }

        if (error2) {
          message.error(error2.message);
        }

        dispatch(
          analyticsActions.setSalesSummary({
            completed_sales: (salesSummary as any)?.total_completed_sales || 0,
            pending_sales: (salesSummary as any)?.total_pending_sales || 0,
            completed_sales_amount:
              (salesSummary as any)?.total_completed_amount || 0,
            pending_sales_amount:
              (salesSummary as any)?.total_pending_amount || 0,
          }),
        );

        const salesData: BarChartDataItem[] = [];
        const salesDataAmounts: BarChartDataItem[] = [];

        rangeDates.forEach((date) => {
          const sales = salesByDates.find(
            (sale: any) => sale.sale_date === date,
          );
          salesData.push({
            date,
            Pagado: sales?.total_completed_sales || 0,
            Pendiente: sales?.total_pending_sales || 0,
          });
          salesDataAmounts.push({
            date,
            Pagado: sales?.total_completed_amount || 0,
            Pendiente: sales?.total_pending_amount || 0,
          });
        });

        dispatch(
          analyticsActions.setSales({
            total_sales_chart_data: salesData,
            total_sales_amount_chart_data: salesDataAmounts,
          }),
        );
      },
    getLastSales: () => async (dispatch: AppDispatch, getState: AppState) => {
      const company_id = getState().app.company.company_id;
      const filters = getState().analytics?.sales?.filters;

      const [last10SalesResponse, pendingSalesResponse] = await Promise.all([
        supabase
          .from('sales')
          .select(
            'sale_id, customers (name), payment_method, created_at, total',
          )
          .eq('company_id', company_id)
          .eq('status_id', STATUS_DATA.PAID.id)
          .order('created_at', { ascending: false })
          .limit(filters?.limits?.completed || 5),
        supabase
          .from('sales')
          .select('sale_id, customers (name), created_at, total')
          .eq('company_id', company_id)
          .eq('status_id', STATUS_DATA.PENDING.id)
          .order('created_at', { ascending: false })
          .limit(filters?.limits?.pending || 5),
      ]);

      const { data: last10Sales, error: error1 } = last10SalesResponse;
      const { data: pendingSales, error: error2 } = pendingSalesResponse;

      dispatch(analyticsActions.setSales({ loading: false }));

      if (error1) {
        message.error(error1.message);
      }

      if (error2) {
        message.error(error2.message);
      }

      dispatch(
        analyticsActions.setSales({
          last_sales: {
            completed: last10Sales || [],
            pending: pendingSales || [],
          },
        }),
      );
    },
    getLastPendingSales:
      () => async (dispatch: AppDispatch, getState: AppState) => {
        const company_id = getState().app.company.company_id;
        const filters = getState().analytics?.sales?.filters;
        const lastSalesData = getState().analytics?.sales?.last_sales;

        const { data, error } = await supabase
          .from('sales')
          .select('sale_id, customers (name), created_at, total')
          .eq('company_id', company_id)
          .eq('status_id', STATUS_DATA.PENDING.id)
          .order('created_at', { ascending: false })
          .limit(filters?.limits?.pending || 5);

        if (error) {
          message.error(error.message);
        }

        dispatch(
          analyticsActions.setSales({
            last_sales: {
              ...lastSalesData,
              pending: data || [],
            },
          }),
        );
      },
    getLastCompletedSales:
      () => async (dispatch: AppDispatch, getState: AppState) => {
        const company_id = getState().app.company.company_id;
        const filters = getState().analytics?.sales?.filters;
        const lastSalesData = getState().analytics?.sales?.last_sales;

        const { data, error } = await supabase
          .from('sales')
          .select(
            'sale_id, customers (name), payment_method, created_at, total',
          )
          .eq('company_id', company_id)
          .eq('status_id', STATUS_DATA.PAID.id)
          .order('created_at', { ascending: false })
          .limit(filters?.limits?.completed || 5);

        if (error) {
          message.error(error.message);
        }

        dispatch(
          analyticsActions.setSales({
            last_sales: {
              ...lastSalesData,
              completed: data || [],
            },
          }),
        );
      },
  },
  profit: {
    getHistoriReport:
      () => async (dispatch: AppDispatch, getState: AppState) => {
        const company_id = getState().app.company.company_id;
        const { data, error } = await supabase
          .rpc('get_net_profit', {
            p_company_id: company_id,
            p_date_from: null,
            p_date_to: null,
          })
          .single();

        if (error) {
          message.error(error.message);
        }

        console.log('Data from service: ', data);

        dispatch(
          analyticsActions.setProfitSummary({
            completed_expenses: (data as any)?.completed_expenses || 0,
            completed_sales: (data as any)?.completed_sales || 0,
            pending_expenses: (data as any)?.pending_expenses || 0,
            pending_sales: (data as any)?.pending_sales || 0,
          }),
        );
      },
    getFullDataByFilters:
      () => async (dispatch: AppDispatch, getState: AppState) => {
        const filters = getState().analytics?.profit?.filters;
        const company_id = getState().app.company.company_id;
        let [start_date, end_date, rangeDates] = getDateRange(
          filters?.date_range,
          filters?.custom_dates,
        );

        dispatch(analyticsActions.setProfitAnalytics({ loading: true }));

        const filtersData = {
          p_company_id: company_id,
          p_branch_ids: filters?.branches?.length ? filters?.branches : null,
          p_start_date: start_date || null,
          p_end_date: end_date || null,
        };

        const [incomesResponse, expensesResponse] = await Promise.all([
          supabase.rpc('get_incomes_by_date', filtersData),
          supabase.rpc('get_expenses_by_date', filtersData),
        ]);

        const { data: incomesByDates, error: error1 } = incomesResponse;
        const { data: expensesByDates, error: error2 } = expensesResponse;

        dispatch(analyticsActions.setProfitAnalytics({ loading: false }));

        if (error1) {
          message.error(error1.message);
        }

        if (error2) {
          message.error(error2.message);
        }

        let summaryByRange = {
          completed_expenses: 0,
          completed_sales: 0,
          pending_expenses: 0,
          pending_sales: 0,
        };

        const chartData: LineChartData = [
          {
            id: 'Entradas',
            color: 'hsl(0, 70%, 50%)',
            data:
              rangeDates?.map((date) => {
                const income = incomesByDates.find(
                  (income: any) => income?.date === date,
                );
                const total =
                  income?.completed_amount || 0 + income?.pending_amount || 0;

                summaryByRange.completed_sales += income?.completed_amount || 0;
                summaryByRange.pending_sales += income?.pending_amount || 0;

                return {
                  completed: income?.completed_amount || 0,
                  pending: income?.pending_amount || 0,
                  x: date,
                  y: total,
                  total,
                } as LineChartDataItem;
              }) || [],
          },
          {
            id: 'Gastos',
            color: 'hsl(0, 70%, 50%)',
            data:
              rangeDates?.map((date) => {
                const expense = expensesByDates.find(
                  (expense: any) => expense?.date === date,
                );
                const total =
                  expense?.completed_amount || 0 + expense?.pending_amount || 0;

                summaryByRange.completed_expenses +=
                  expense?.completed_amount || 0;
                summaryByRange.pending_expenses += expense?.pending_amount || 0;

                return {
                  completed: expense?.completed_amount || 0,
                  pending: expense?.pending_amount || 0,
                  x: date,
                  y: total,
                  total,
                } as LineChartDataItem;
              }) || [],
          },
        ];

        dispatch(
          analyticsActions.setProfitAnalytics({
            data: chartData,
            summary_by_range: summaryByRange,
          }),
        );
      },
  },
  expenses: {
    getExpensesByWeek:
      () => async (dispatch: AppDispatch, getState: AppState) => {
        const company_id = getState().app?.company?.company_id;
        let [start_date, end_date] = getDateRange('last_7_days');

        const { data, error } = await supabase.rpc(
          'get_operating_costs_by_category',
          {
            p_company_id: company_id,
            p_operational_category_ids: null,
            p_branch_ids: null,
            p_start_date: start_date,
            p_end_date: end_date,
          },
        );

        dispatch(analyticsActions.setExpensesData({ loading: false }));

        if (error) {
          message.error(error.message);
        }

        let pieData: PieChartItem[] = [];

        data?.forEach(
          (category: {
            operational_category_id: any;
            category_name: any;
            total_amount: any;
          }) => {
            pieData.push({
              id: category?.operational_category_id,
              label: category?.category_name,
              value: category?.total_amount,
            });
          },
        );

        dispatch(analyticsActions.setExpensesCharts({ pie: pieData }));
      },
    getExpensesByDate:
      () => async (dispatch: AppDispatch, getState: AppState) => {
        const filters = getState().analytics?.expenses?.filters;
        const company_id = getState().app.company.company_id;
        let [start_date, end_date, rangeDates] = getDateRange(
          filters?.date_range || 'last_7_days',
          filters?.custom_dates,
        );

        dispatch(analyticsActions.setExpensesData({ loading: true }));

        let filtersData = {
          p_company_id: company_id,
          p_branch_ids: filters?.branches?.length ? filters?.branches : null,
          p_start_date: start_date || null,
          p_end_date: end_date || null,
        };

        const [expensesResponse] = await Promise.all([
          supabase.rpc('get_expenses_by_date', filtersData),
        ]);

        const { data, error } = expensesResponse;

        dispatch(analyticsActions.setExpensesData({ loading: false }));

        if (error) {
          message.error(error.message);
        }

        let summaryByRange = {
          completed_expenses: 0,
          pending_expenses: 0,
        };
        console.log(rangeDates);
        const chartData: LineChartData = [
          {
            id: 'Gastos',
            color: 'hsl(0, 70%, 50%)',
            data:
              rangeDates?.map((date) => {
                const expense = data.find(
                  (expense: any) => expense?.date === date,
                );
                const total =
                  expense?.completed_amount || 0 + expense?.pending_amount || 0;

                summaryByRange.completed_expenses +=
                  expense?.completed_amount || 0;
                summaryByRange.pending_expenses += expense?.pending_amount || 0;

                return {
                  completed: expense?.completed_amount || 0,
                  pending: expense?.pending_amount || 0,
                  x: date,
                  y: total,
                  total,
                } as LineChartDataItem;
              }) || [],
          },
        ];

        dispatch(analyticsActions.setExpensesCharts({ line: chartData }));
      },
    getExpensesByCategory:
      () => async (dispatch: AppDispatch, getState: AppState) => {
        const company_id = getState().app?.company?.company_id;
        const filters = getState().analytics?.expenses?.filters;
        let [start_date, end_date] = getDateRange(
          filters?.date_range || 'last_7_days',
          filters?.custom_dates,
        );

        const { data, error } = await supabase.rpc(
          'get_operating_costs_by_category',
          {
            p_company_id: company_id,
            p_operational_category_ids: null,
            p_branch_ids: filters?.branches?.length ? filters?.branches : null,
            p_start_date: start_date,
            p_end_date: end_date,
          },
        );

        dispatch(analyticsActions.setExpensesData({ loading: false }));

        if (error) {
          message.error(error.message);
        }

        let pieData: PieChartItem[] = [];
        let totalAmount = 0;

        data?.forEach(
          (category: {
            operational_category_id: any;
            category_name: any;
            total_amount: any;
          }) => {
            totalAmount += category?.total_amount || 0;
            pieData.push({
              id: category?.operational_category_id,
              label: category?.category_name,
              value: category?.total_amount,
            });
          },
        );

        dispatch(
          analyticsActions.setExpensesCharts({
            pieCustom: pieData,
            totalAmount,
          }),
        );
      },
  },
};
