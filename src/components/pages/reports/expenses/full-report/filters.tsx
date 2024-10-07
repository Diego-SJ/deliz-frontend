import { DATE_REANGE_NAMES } from '@/constants/catalogs';
import { useAppDispatch, useAppSelector } from '@/hooks/useStore';
import { analyticsActions } from '@/redux/reducers/analytics';
import { branchesActions } from '@/redux/reducers/branches';
import { DateRangeKey } from '@/utils/sales-report';
import { Button, DatePicker, Dropdown, Space } from 'antd';
import dayjs from 'dayjs';
import { Building, CalendarDays, FilterX, SearchIcon } from 'lucide-react';
import functions from '@/utils/functions';

const ProfitReportFilters = () => {
  const dispatch = useAppDispatch();
  const { branches } = useAppSelector(({ branches }) => branches);
  const { filters } = useAppSelector(({ analytics }) => analytics?.expenses);
  const filtersApplied =
    !!filters?.branches?.length || filters?.date_range !== 'last_7_days';

  const fetchReportData = () => {
    dispatch(analyticsActions.expenses.getExpensesByDate());
    dispatch(analyticsActions.expenses.getExpensesByCategory());
  };

  const onDateRangeChange = async (date_range: DateRangeKey) => {
    dispatch(analyticsActions.setExpensesFilters({ date_range }));
    await functions.sleep(100);
    if (date_range !== 'custom') {
      dispatch(
        analyticsActions.setExpensesFilters({ custom_dates: [null, null] }),
      );
      fetchReportData();
    }
  };

  const onBranchChange = async (value: string) => {
    let branchesSelected: string[] = [...(filters?.branches || [])];
    if (value === 'ALL') {
      branchesSelected = [];
    } else if (filters?.branches?.includes(value)) {
      branchesSelected = filters?.branches?.filter((b) => b !== value) || [];
    } else {
      branchesSelected.push(value);
    }
    dispatch(
      analyticsActions.setExpensesFilters({ branches: branchesSelected }),
    );
    await functions.sleep(100);
    fetchReportData();
  };

  const removeFilters = async () => {
    dispatch(analyticsActions.setExpensesFilters({ branches: [] }));
    await onDateRangeChange('last_7_days');
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-3 md:items-center">
        <Space.Compact>
          <Dropdown
            menu={{
              selectedKeys: filters?.branches?.length
                ? filters?.branches
                : ['ALL'],
              items: [{ key: 'ALL', label: 'Todas' }].concat(
                branches?.map((branch) => ({
                  label: branch?.name,
                  key: branch?.branch_id,
                })),
              ),

              selectable: true,
              onClick: async ({ key }) => onBranchChange(key),
            }}
            onOpenChange={(open) => {
              if (!branches?.length && open)
                dispatch(branchesActions.getBranches());
            }}
          >
            <Button icon={<Building className="text-base w-4 h-4" />}>
              Sucursales
            </Button>
          </Dropdown>
          <Dropdown
            menu={{
              selectedKeys: [filters?.date_range || 'last_7_days'],
              items: [
                { key: 'today', label: 'Hoy' },
                { key: 'last_7_days', label: 'Últimos 7 días' },
                { key: 'this_month', label: 'Este mes' },
                { key: 'last_month', label: 'Mes pasado' },
                { key: 'custom', label: 'Personalizado' },
              ],
              selectable: true,
              onClick: async ({ key }) =>
                onDateRangeChange(key as DateRangeKey),
            }}
          >
            <Button icon={<CalendarDays className="text-base w-4 h-4" />}>
              {DATE_REANGE_NAMES[filters?.date_range || 'last_7_days']}
            </Button>
          </Dropdown>
          {filtersApplied ? (
            <Button
              ghost
              className={'!bg-white'}
              type={'primary'}
              icon={<FilterX className="text-base w-4 h-4" />}
              onClick={removeFilters}
            />
          ) : null}
        </Space.Compact>

        {filters?.date_range === 'custom' && (
          <Space.Compact>
            <DatePicker.RangePicker
              value={[
                filters?.custom_dates?.length && filters?.custom_dates[0]
                  ? dayjs(filters?.custom_dates[0])
                  : null,
                filters?.custom_dates?.length && filters?.custom_dates[1]
                  ? dayjs(filters?.custom_dates[1])
                  : null,
              ]}
              maxDate={dayjs()}
              format={['DD MMM, YYYY', 'DD MMM, YYYY']}
              onChange={(dates) => {
                const custom_dates = dates
                  ? [
                      dates[0]?.toISOString() || null,
                      dates[1]?.toISOString() || null,
                    ]
                  : [null, null];
                dispatch(analyticsActions.setExpensesFilters({ custom_dates }));
              }}
            />
            <Button
              onClick={fetchReportData}
              icon={<SearchIcon className="w-4 h-4" />}
            />
          </Space.Compact>
        )}
      </div>
    </>
  );
};

export default ProfitReportFilters;
