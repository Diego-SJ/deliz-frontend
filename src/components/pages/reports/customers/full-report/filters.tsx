import { DATE_REANGE_NAMES } from '@/constants/catalogs';
import { useAppDispatch, useAppSelector } from '@/hooks/useStore';
import { analyticsActions } from '@/redux/reducers/analytics';
import { DateRangeKey } from '@/utils/sales-report';
import { Button, DatePicker, Dropdown, Space } from 'antd';
import dayjs from 'dayjs';
import { CalendarDays, FilterX, SearchIcon } from 'lucide-react';
import functions from '@/utils/functions';
import { useState } from 'react';

const CustomersFilters = () => {
  const dispatch = useAppDispatch();
  const { loading, last_customer_sales } = useAppSelector(
    ({ analytics }) => analytics?.customers,
  );
  const filters = last_customer_sales?.filters;
  const filtersApplied = filters?.date_range !== 'last_7_days';

  const fetchReportData = () => {
    dispatch(analyticsActions.customers.getLastCustomerSales());
  };

  const onDateRangeChange = async (date_range: DateRangeKey) => {
    dispatch(analyticsActions.setCustomerSalesFilters({ date_range }));
    await functions.sleep(100);
    if (date_range !== 'custom') {
      dispatch(
        analyticsActions.setCustomerSalesFilters({
          custom_dates: [null, null],
        }),
      );
      fetchReportData();
    }
  };

  const removeFilters = async () => {
    await onDateRangeChange('last_7_days');
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-3 md:items-center">
        <Space.Compact>
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
            <Button
              icon={<CalendarDays className="text-base w-4 h-4" />}
              loading={loading}
            >
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
                dispatch(
                  analyticsActions.setCustomerSalesFilters({ custom_dates }),
                );
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

export default CustomersFilters;
