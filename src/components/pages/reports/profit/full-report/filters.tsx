import { DATE_REANGE_NAMES } from '@/constants/catalogs';
import useMediaQuery from '@/hooks/useMediaQueries';
import { useAppDispatch, useAppSelector } from '@/hooks/useStore';
import { analyticsActions } from '@/redux/reducers/analytics';
import { branchesActions } from '@/redux/reducers/branches';
import functions from '@/utils/functions';
import { DateRangeKey } from '@/utils/sales-report';
import { Avatar, Button, DatePicker, Drawer, Dropdown, Select, Space, Typography } from 'antd';
import dayjs from 'dayjs';
import { Building2, CalendarDays, Filter, FilterX, SearchIcon } from 'lucide-react';
import { useState } from 'react';

const ProfitReportFilters = () => {
  const dispatch = useAppDispatch();
  const { branches } = useAppSelector(({ branches }) => branches);
  const { filters } = useAppSelector(({ analytics }) => analytics?.profit);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [branchesSelected, setBranchesSelected] = useState<string[]>([]);
  const { isTablet } = useMediaQuery();
  const filtersApplied = !!filters?.branches?.length;

  const fetchReportData = () => {
    dispatch(analyticsActions.profit.getFullDataByFilters());
    // dispatch(analyticsActions.sales.getLastSales());
  };

  const handleDrawer = () => {
    setOpenDrawer(prev => !prev);
  };

  const openFiltersDrawer = () => {
    setOpenDrawer(true);
    if (filters?.branches?.length) setBranchesSelected(filters?.branches);
  };

  const onDateRangeChange = async (dateRange: DateRangeKey) => {
    await dispatch(analyticsActions.setProfitFilters({ date_range: dateRange }));
    if (dateRange !== 'custom') {
      dispatch(analyticsActions.setProfitFilters({ custom_dates: [null, null] }));
      fetchReportData();
    }
  };

  const removeFilters = () => {
    setBranchesSelected([]);
  };

  const applyFilters = () => {
    dispatch(
      analyticsActions.setProfitFilters({
        branches: branchesSelected,
      }),
    );
    fetchReportData();
    handleDrawer();
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-3 md:items-center">
        <Space.Compact className="">
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
              onClick: async ({ key }) => onDateRangeChange(key as DateRangeKey),
            }}
          >
            <Button icon={<CalendarDays className="text-base w-4 h-4" />}>
              {DATE_REANGE_NAMES[filters?.date_range || 'last_7_days']}
            </Button>
          </Dropdown>
          <Button
            ghost={filtersApplied}
            className={filtersApplied ? '!bg-white' : ''}
            type={filtersApplied ? 'primary' : 'default'}
            icon={filtersApplied ? <FilterX className="text-base w-4 h-4" /> : <Filter className="text-base w-4 h-4" />}
            onClick={openFiltersDrawer}
          />
        </Space.Compact>

        {filters?.date_range === 'custom' && (
          <Space.Compact>
            <DatePicker.RangePicker
              value={[
                filters?.custom_dates[0] ? dayjs(filters?.custom_dates[0]) : null,
                filters?.custom_dates[1] ? dayjs(filters?.custom_dates[1]) : null,
              ]}
              maxDate={dayjs()}
              format={['DD MMM, YYYY', 'DD MMM, YYYY']}
              onChange={dates => {
                const custom_dates = dates ? [dates[0]?.toISOString() || null, dates[1]?.toISOString() || null] : [null, null];
                dispatch(analyticsActions.setProfitFilters({ custom_dates }));
              }}
            />
            <Button onClick={fetchReportData} icon={<SearchIcon className="w-4 h-4" />} />
          </Space.Compact>
        )}
      </div>

      <Drawer
        open={openDrawer}
        onClose={handleDrawer}
        placement={isTablet ? 'bottom' : 'right'}
        height={isTablet ? '70%' : 'auto'}
        title="Agregar filtros"
        extra={
          filtersApplied ? (
            <Button icon={<FilterX className="w-4 h-4" />} onClick={removeFilters}>
              Remover filtros
            </Button>
          ) : null
        }
      >
        <Typography.Paragraph>Agrega filtros para personalizar tu reporte</Typography.Paragraph>

        <Typography.Paragraph className="!font-semibold !mb-1">Sucursales</Typography.Paragraph>
        <Select
          mode="multiple"
          allowClear
          className="!mb-8 w-full"
          placeholder="Selecciona una o varias sucursales"
          options={branches?.map(product => ({
            ...product,
            label: product?.name,
            value: product?.branch_id,
          }))}
          showSearch
          filterOption={(input, option) => functions.includes(option?.name, input.toLowerCase())}
          onFocus={() => {
            if (!branches?.length) dispatch(branchesActions.getBranches());
          }}
          onChange={setBranchesSelected}
          value={branchesSelected}
          optionRender={item => (
            <div className="flex gap-3 items-center">
              <Avatar icon={<Building2 className="text-slate-400 w-4 h-4" />} className="!w-10 !h-10 bg-slate-600/10" />
              <p className="m-0 text-sm font-normal">{item.data?.name}</p>
            </div>
          )}
        />

        <Button size="large" block className="!mt-3" onClick={applyFilters}>
          Aplicar
        </Button>
      </Drawer>
    </>
  );
};

export default ProfitReportFilters;
