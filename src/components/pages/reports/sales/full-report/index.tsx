import CardRoot from '@/components/atoms/Card';
import { STATUS_DATA } from '@/constants/status';
import { Avatar, Button, Col, Divider, Dropdown, Row, Select, Typography } from 'antd';
import { ArrowLeft, CalendarDays, CircleDollarSign, Printer, ShoppingCart, Store, UserRoundSearchIcon } from 'lucide-react';

const SalesReports = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-5">
        <div className="flex items-center gap-2">
          <Button icon={<ArrowLeft strokeWidth={1.5} className="w-4 h-4" />} />
          <Typography.Title level={4} className="!m-0">
            Reporte de Ventas
          </Typography.Title>
        </div>
        <Button type="primary" icon={<Printer strokeWidth={1.5} className="w-4 h-4" />}>
          Imprimir
        </Button>
      </div>
      <Row className="" gutter={[20, 20]}>
        <Col xs={24} md={8}>
          <CardRoot
            className="!mb-5"
            classNames={{
              body: '!p-5',
            }}
          >
            <div className="w-full flex items-center py-0 gap-5 ">
              <Avatar icon={<ShoppingCart className="text-indigo-600" />} className="bg-indigo-600/10 w-12 h-12" />
              <div>
                <h5 className="m-0 text-2xl font-semibold">12,456</h5>
                <p className="m-0 text-sm font-light text-gray-400">ventas realizadas</p>
              </div>
            </div>
            <Divider />
            <div className="w-full flex items-center py-0 gap-5">
              <Avatar icon={<CircleDollarSign className="text-green-600" />} className="bg-green-600/10 w-12 h-12" />
              <div>
                <h5 className="m-0 text-2xl font-semibold">$212,456</h5>
                <p className="m-0 text-sm font-light text-gray-400">monto en ventas</p>
              </div>
            </div>
          </CardRoot>

          <CardRoot
            title="Últimas ventas"
            extra={
              <Select
                className="!w-28"
                value={STATUS_DATA.PAID.id}
                options={[
                  { label: STATUS_DATA.PAID.name, value: STATUS_DATA.PAID.id },
                  { label: STATUS_DATA.PENDING.name, value: STATUS_DATA.PENDING.id },
                ]}
              />
            }
            classNames={{
              body: '!p-0',
            }}
          >
            <div className="w-full flex items-center py-3 px-4 gap-5">
              <Avatar icon={<ShoppingCart className="text-slate-600 w-4 h-4" />} className="bg-slate-600/10 w-8 min-w-8 h-8" />
              <div className="flex items-center justify-between w-full">
                <h5 className="m-0 text-sm font-medium capitalize">Juan diego salas</h5>
                <p className="m-0 text-sm font-light text-gray-400">$100.00</p>
              </div>
            </div>
          </CardRoot>
        </Col>
        <Col xs={24} md={16}>
          <div className="grid grid-cols-3 mb-5 gap-5">
            <Dropdown
              menu={{
                // selectedKeys: [filters?.products?.order_by || 'name,asc'],
                items: [
                  { key: 'today', label: 'Hoy' },
                  { key: 'last_7_days', label: 'Últimos 7 días' },
                  { key: 'last_30_days', label: 'Últimos 30 días' },
                  { key: 'this_month', label: 'Este mes' },
                  { key: 'last_month', label: 'Mes pasado' },
                  { key: 'custom', label: 'Personalizado' },
                ],
                selectable: true,
                // onClick: async ({ key }) => onOrderChange(key),
              }}
            >
              <Button block icon={<CalendarDays className="text-base w-5 h-5" />}>
                Hoy
              </Button>
            </Dropdown>
            <Dropdown
              menu={{
                // selectedKeys: [filters?.products?.order_by || 'name,asc'],
                items: [
                  { key: 'today', label: 'Hoy' },
                  { key: 'last_7_days', label: 'Últimos 7 días' },
                  { key: 'last_30_days', label: 'Últimos 30 días' },
                  { key: 'this_month', label: 'Este mes' },
                  { key: 'last_month', label: 'Mes pasado' },
                  { key: 'custom', label: 'Personalizado' },
                ],
                selectable: true,
                // onClick: async ({ key }) => onOrderChange(key),
              }}
            >
              <Button block icon={<Store className="text-base w-5 h-5" />}>
                Sucursal
              </Button>
            </Dropdown>
            <Dropdown
              menu={{
                // selectedKeys: [filters?.products?.order_by || 'name,asc'],
                items: [
                  { key: 'today', label: 'Hoy' },
                  { key: 'last_7_days', label: 'Últimos 7 días' },
                  { key: 'last_30_days', label: 'Últimos 30 días' },
                  { key: 'this_month', label: 'Este mes' },
                  { key: 'last_month', label: 'Mes pasado' },
                  { key: 'custom', label: 'Personalizado' },
                ],
                selectable: true,
                // onClick: async ({ key }) => onOrderChange(key),
              }}
            >
              <Button block icon={<UserRoundSearchIcon className="text-base w-5 h-5" />}>
                Cliente
              </Button>
            </Dropdown>
          </div>
          <CardRoot></CardRoot>
        </Col>
      </Row>
    </div>
  );
};

export default SalesReports;
