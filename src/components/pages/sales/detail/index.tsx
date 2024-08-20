import { APP_ROUTES } from '@/routes/routes';
import { useAppDispatch, useAppSelector } from '@/hooks/useStore';
import { DeleteOutlined, EditOutlined, EllipsisOutlined, FileImageOutlined } from '@ant-design/icons';
import { Avatar, Breadcrumb, Col, Typography, Row, Alert, Table, AlertProps, Divider, Button, App, Dropdown } from 'antd';
import { Link, useParams } from 'react-router-dom';
import functions from '@/utils/functions';
import { useEffect, useRef, useState } from 'react';
import { salesActions } from '@/redux/reducers/sales';
import { SaleItem } from '@/redux/reducers/sales/types';
import { STATUS, STATUS_DATA } from '@/constants/status';
import UpdateSaleButton from './update-sale-btn';
import PrintInvoiceButton from './print-invoice-btn';
import AddNewItem from './detail-item-actions/add-new-item';
import DeleteSaleButton from './delete-sale-btn';
import CardRoot from '@/components/atoms/Card';
import EditSaleItemModal from './detail-item-actions/edit-item';
import ChangeCustomerModal from './change-customer';
import { PAYMENT_METHOD_SHORT_NAME } from '@/constants/payment_methods';
import useMediaQuery from '@/hooks/useMediaQueries';
import PaginatedList from '@/components/organisms/PaginatedList';

export type Amounts = {
  total: number;
  subtotal: number;
  pending: number;
  cashback: number;
  amount_paid: number;
  discount?: number;
};

const initalAmounts = { total: 0, subtotal: 0, pending: 0, cashback: 0, amount_paid: 0, discount: 0 };

const SaleDetail = () => {
  const dispatch = useAppDispatch();
  const { sale_id } = useParams();
  const { current_sale, loading: isLoading } = useAppSelector(({ sales }) => sales);
  const { permissions } = useAppSelector(({ users }) => users?.user_auth?.profile!);

  const [amounts, setAmounts] = useState<Amounts>(initalAmounts);
  const [open, setOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<SaleItem>();
  const firstRender = useRef(false);
  const { isTablet } = useMediaQuery();
  const { modal } = App.useApp();
  const { metadata, items = [] } = current_sale;

  useEffect(() => {
    if (!firstRender.current && !!sale_id) {
      firstRender.current = true;
      dispatch(salesActions.getSaleById({ sale_id: Number(sale_id), refetch: true }));
      return;
    }
  }, [sale_id]);

  useEffect(() => {
    let subtotal = items?.reduce((acum, item) => acum + (item?.price || 0) * (item?.quantity || 0), 0);
    let color = STATUS.find(item => item.id === metadata?.status_id)?.color ?? 'info';
    let total = subtotal + (metadata?.shipping || 0);
    // get discount function
    if (metadata?.discount_type === 'AMOUNT') {
      total = total - (metadata?.discount || 0);
    } else if (metadata?.discount_type === 'PERCENTAGE') {
      total = total - (total * (metadata?.discount || 0)) / 100;
    }

    const _amounts = {
      color,
      subtotal,
      cashback: metadata?.cashback || 0,
      amount_paid: metadata?.amount_paid || 0,
      pending: total - (metadata?.amount_paid || 0),
      total: total,
      discount: metadata?.discount || 0,
    };
    setAmounts(_amounts);
  }, [items, metadata]);

  const onRowClick = (record: SaleItem) => {
    setCurrentItem(record);
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
  };

  return (
    <div className="max-w-[1200px] mx-auto">
      <Row justify="space-between">
        <Col span={24}>
          <Breadcrumb
            items={[
              {
                title: <Link to={APP_ROUTES.PRIVATE.HOME.path}>{APP_ROUTES.PRIVATE.HOME.title}</Link>,
                key: 'dashboard',
              },
              {
                title: <Link to={APP_ROUTES.PRIVATE.SALES.path}>{APP_ROUTES.PRIVATE.SALES.title}</Link>,
                key: 'Ventas',
              },
              {
                title: `Detalle de la venta (${current_sale?.metadata?.sale_id || '- - -'})`,
              },
            ]}
          />
        </Col>
      </Row>
      <Row style={{ marginTop: '20px' }} gutter={[20, 20]}>
        <Col xl={{ span: 8 }} xs={24} md={24} lg={10}>
          {/* SALE AMOUNTS */}
          <CardRoot loading={isLoading} title="Resumen">
            <Alert
              message={metadata?.status.name ?? '- - -'}
              type={ALERT_COLORS[metadata?.status_id ?? 6]}
              showIcon
              style={{ marginBottom: 15 }}
            />
            <Row gutter={[10, 10]}>
              <Col span={12}>
                <Typography.Paragraph type="secondary" style={{ margin: 0 }}>{`Subtotal: ${functions.money(
                  amounts?.subtotal,
                )}`}</Typography.Paragraph>
                {(metadata?.shipping || 0) > 0 && (
                  <Typography.Paragraph type="secondary" style={{ margin: 0 }}>{`Envío: ${functions.money(
                    metadata?.shipping,
                  )}`}</Typography.Paragraph>
                )}
                {!!amounts?.discount && (
                  <Typography.Paragraph type="secondary" style={{ margin: 0 }}>{`Descuento:  ${
                    metadata?.discount_type === 'AMOUNT' ? '$' : ''
                  }${amounts?.discount}${metadata?.discount_type === 'PERCENTAGE' ? '%' : ''}`}</Typography.Paragraph>
                )}
                {Number(amounts?.pending) > 0 && (
                  <Typography.Paragraph className="text-amber-600" style={{ margin: 0 }}>{`Pendiente: ${functions.money(
                    amounts?.pending,
                  )}`}</Typography.Paragraph>
                )}
              </Col>
              <Col span={12} style={{ display: 'flex', alignItems: 'flex-end', flexDirection: 'column' }}>
                <Typography.Paragraph type="secondary" style={{ margin: 0 }}>{`Pagado: ${functions.money(
                  amounts?.amount_paid,
                )}`}</Typography.Paragraph>

                <Typography.Paragraph type="secondary" style={{ margin: '0 0 10px' }}>
                  {`Cambio: ${functions.money(amounts?.cashback)}`}
                </Typography.Paragraph>
              </Col>
            </Row>

            <Typography.Title level={3} style={{ margin: 0, marginTop: 10 }}>{`Total: ${functions.money(
              amounts?.total,
            )}`}</Typography.Title>

            {[STATUS_DATA.PENDING.id].includes(current_sale?.metadata?.status_id as number) && permissions?.sales?.edit_sale && (
              <Row gutter={[10, 10]} className="!mt-4">
                <Col span={24}>
                  <UpdateSaleButton amounts={amounts} />
                </Col>
              </Row>
            )}

            {isTablet && (
              <Row gutter={[20, 20]} className="!mt-5">
                <Col xs={8}>
                  <PrintInvoiceButton amounts={amounts} />
                </Col>
                {permissions?.sales?.edit_sale && (
                  <Col xs={8}>
                    <AddNewItem />
                  </Col>
                )}
                {permissions?.sales?.delete_sale && (
                  <Col xs={8}>
                    <DeleteSaleButton />
                  </Col>
                )}
              </Row>
            )}
          </CardRoot>

          {/* CUSTOMER CARD DETAILS */}
          {!isTablet && (
            <CardRoot loading={isLoading} style={{ marginTop: 20 }}>
              <div className="w-full ">
                <Typography.Title level={5} className="!font-medium !text-sm !mb-0">
                  Cliente
                </Typography.Title>
                <div className="flex items-center justify-between">
                  <Typography.Paragraph className="w-full !m-0" type="secondary">
                    {current_sale?.metadata?.customers?.name || 'Público general'}
                  </Typography.Paragraph>

                  {permissions?.sales?.edit_sale && <ChangeCustomerModal />}
                </div>
              </div>
              <Divider className="!my-3" />
              <div className="w-full ">
                <Typography.Title level={5} className="!font-medium !text-sm !mb-0">
                  Fecha
                </Typography.Title>
                <div className="flex items-center justify-between">
                  <Typography.Paragraph className="w-full !m-0" type="secondary">
                    {functions.formatToLocalTimezone(metadata?.created_at?.toString() || '')}
                  </Typography.Paragraph>
                </div>
              </div>
              <Divider className="!my-3" />
              <div className="w-full ">
                <Typography.Title level={5} className="!font-medium !text-sm !mb-0">
                  Método de pago
                </Typography.Title>
                <div className="flex items-center justify-between">
                  <Typography.Paragraph className="w-full !m-0" type="secondary">
                    {PAYMENT_METHOD_SHORT_NAME[metadata?.payment_method || ''] || '- - -'}
                  </Typography.Paragraph>
                </div>
              </div>
              <Divider className="!my-3" />
              <div className="w-full ">
                <Typography.Title level={5} className="!font-medium !text-sm !mb-0">
                  Caja
                </Typography.Title>
                <div className="flex items-center justify-between">
                  <Typography.Paragraph className="w-full !m-0" type="secondary">
                    Caja {(metadata as any)?.cash_registers?.name || '- - -'}
                  </Typography.Paragraph>
                </div>
              </div>
              <Divider className="!my-3" />

              <div className="w-full ">
                <Typography.Title level={5} className="!font-medium !text-sm !mb-0">
                  Sucursal
                </Typography.Title>
                <div className="flex items-center justify-between">
                  <Typography.Paragraph className="w-full !m-0" type="secondary">
                    Sucursal {(metadata as any)?.branches?.name || '- - -'}
                  </Typography.Paragraph>
                </div>
              </div>
            </CardRoot>
          )}
        </Col>
        <Col xl={{ span: 16 }} xs={24} md={24} lg={14}>
          {!isTablet && (
            <CardRoot style={{ marginBottom: 10 }} loading={isLoading} title="Acciones">
              <Row gutter={[20, 20]}>
                <Col xs={12} md={6} lg={8}>
                  <PrintInvoiceButton amounts={amounts} />
                </Col>
                {permissions?.sales?.edit_sale && (
                  <Col xs={12} md={6} lg={8}>
                    <AddNewItem />
                  </Col>
                )}
                {permissions?.sales?.delete_sale && (
                  <Col xs={12} md={6} lg={8}>
                    <DeleteSaleButton />
                  </Col>
                )}
              </Row>
            </CardRoot>
          )}
          {!isTablet ? (
            <CardRoot styles={{ body: { padding: '0 0 2px 0', overflow: 'hidden' } }}>
              <Table
                loading={isLoading}
                rowKey={record => record?.sale_detail_id?.toString() || ''}
                columns={[
                  {
                    title: 'Producto',
                    dataIndex: 'products',
                    render: (_, record) => {
                      return (
                        <div className="flex gap-4 items-center pl-3">
                          <Avatar
                            src={record.products?.image_url}
                            icon={<FileImageOutlined className="text-slate-600 text-2xl" />}
                            className="bg-slate-600/10 p-1 w-10 h-10 min-w-10"
                          />
                          <div>
                            <p className="text-slate-700 font-medium">
                              {record?.products?.name || record?.metadata?.product_name || '- - -'}
                            </p>
                            <span>{record?.products?.categories?.name || 'Sin categoría'}</span>
                          </div>
                        </div>
                      );
                    },
                  },

                  {
                    title: 'Precio',
                    dataIndex: 'price',
                    width: 100,
                    align: 'center',
                    render: (value: number) => functions.money(value),
                  },
                  {
                    title: 'Cantidad',
                    dataIndex: 'quantity',
                    width: 100,
                    align: 'center',
                  },
                  {
                    title: 'Total',
                    dataIndex: 'retail_price',
                    width: 100,
                    align: 'center',
                    render: (_: number, record) => functions.money((record.quantity || 0) * (record.price || 0)),
                  },
                  {
                    title: '',
                    dataIndex: 'sale_detail_id',
                    width: 150,
                    align: 'center',
                    render: (_, record) => {
                      if (!permissions?.sales?.edit_sale) return null;
                      return (
                        <Dropdown
                          menu={{
                            items: [
                              {
                                key: 'edit',
                                label: 'Editar',
                                icon: <EditOutlined />,
                                onClick: () => onRowClick(record),
                              },
                              {
                                key: 'delete',
                                label: 'Eliminar',
                                icon: <DeleteOutlined />,
                                onClick: () => {
                                  modal.confirm({
                                    title: 'Eliminar producto',
                                    content: '¿Estás seguro de que deseas eliminar este producto de la venta?',
                                    onOk: async () => {
                                      await dispatch(salesActions.deleteItemById(record.sale_detail_id || 0));
                                    },
                                    okText: 'Eliminar',
                                    okType: 'danger',
                                    cancelText: 'Cancelar',
                                    maskClosable: true,
                                  });
                                },
                              },
                            ],
                          }}
                          trigger={['click']}
                        >
                          <Button shape="circle" type="text" size="large" icon={<EllipsisOutlined />} />
                        </Dropdown>
                      );
                    },
                  },
                ]}
                dataSource={items}
                size="small"
                scroll={{ y: 'calc(100vh - 250px)', x: 600 }}
                pagination={false}
              />
            </CardRoot>
          ) : (
            <PaginatedList
              className="mt-4 !max-h-[calc(100dvh-44px)]"
              $bodyHeight={items?.length > 6 ? '80dvh' : 'auto'}
              pagination={false}
              dataSource={items}
              renderItem={item => {
                return (
                  <div key={item.product_id} className="flex py-3 pl-4 pr-4 border-b border-gray-200 cursor-pointer items-center">
                    <Avatar
                      src={item.products?.image_url}
                      icon={<FileImageOutlined className="text-slate-600 text-2xl" />}
                      className={`bg-slate-600/10 p-1 w-14 min-w-14 h-14 min-h-14`}
                      size="large"
                      shape="square"
                    />
                    <div className="flex items-start flex-col gap-1 pl-4">
                      <Typography.Paragraph className="!mb-0 text-base">
                        {item.products?.name || item?.metadata?.product_name}
                      </Typography.Paragraph>
                      <Typography.Text type="secondary">{item?.products?.categories?.name || 'Sin categoría'}</Typography.Text>
                      <Typography.Text className="!mb-2" type="secondary">
                        {item.quantity} x {functions.money(item.price)}
                      </Typography.Text>
                    </div>
                    <div className="flex flex-col text-end justify-center self-end ml-auto my-auto gap-4">
                      <Dropdown
                        className="!-mt-3"
                        menu={{
                          items: [
                            {
                              key: 'edit',
                              label: 'Editar',
                              icon: <EditOutlined className="!text-lg !mr-3" />,
                              className: '!text-lg',
                              onClick: () => onRowClick(item),
                            },
                            {
                              key: 'delete',
                              label: 'Eliminar',
                              icon: <DeleteOutlined className="!text-lg !mr-3" />,
                              className: '!text-lg',
                              onClick: () => {
                                modal.confirm({
                                  title: 'Eliminar producto',
                                  content: '¿Estás seguro de que deseas eliminar este producto de la venta?',
                                  onOk: async () => {
                                    await dispatch(salesActions.deleteItemById(item.sale_detail_id || 0));
                                  },
                                  okText: 'Eliminar',
                                  okType: 'danger',
                                  cancelText: 'Cancelar',
                                  maskClosable: true,
                                });
                              },
                            },
                          ],
                        }}
                        trigger={['click']}
                      >
                        <Button shape="circle" type="text" size="large" icon={<EllipsisOutlined />} />
                      </Dropdown>
                      <span className="font-medium mt-2">{functions.money(Number(item.quantity) * Number(item.price))}</span>
                    </div>
                  </div>
                );
              }}
            />
          )}

          {/* CUSTOMER CARD DETAILS */}
          {isTablet && (
            <CardRoot loading={isLoading} style={{ marginTop: 20 }}>
              <div className="w-full ">
                <Typography.Title level={5} className="!font-medium !text-sm !mb-0">
                  Cliente
                </Typography.Title>
                <div className="flex items-center justify-between">
                  <Typography.Paragraph className="w-full !m-0" type="secondary">
                    {current_sale?.metadata?.customers?.name || 'Público general'}
                  </Typography.Paragraph>

                  {permissions?.sales?.edit_sale && <ChangeCustomerModal />}
                </div>
              </div>
              <Divider className="!my-3" />
              <div className="w-full ">
                <Typography.Title level={5} className="!font-medium !text-sm !mb-0">
                  Fecha
                </Typography.Title>
                <div className="flex items-center justify-between">
                  <Typography.Paragraph className="w-full !m-0" type="secondary">
                    {functions.formatToLocalTimezone(metadata?.created_at?.toString() || '')}
                  </Typography.Paragraph>
                </div>
              </div>
              <Divider className="!my-3" />
              <div className="w-full ">
                <Typography.Title level={5} className="!font-medium !text-sm !mb-0">
                  Método de pago
                </Typography.Title>
                <div className="flex items-center justify-between">
                  <Typography.Paragraph className="w-full !m-0" type="secondary">
                    {PAYMENT_METHOD_SHORT_NAME[metadata?.payment_method || ''] || '- - -'}
                  </Typography.Paragraph>
                </div>
              </div>
              <Divider className="!my-3" />
              <div className="w-full ">
                <Typography.Title level={5} className="!font-medium !text-sm !mb-0">
                  Caja
                </Typography.Title>
                <div className="flex items-center justify-between">
                  <Typography.Paragraph className="w-full !m-0" type="secondary">
                    Caja {(metadata as any)?.cash_registers?.name || '- - -'}
                  </Typography.Paragraph>
                </div>
              </div>
              <Divider className="!my-3" />

              <div className="w-full ">
                <Typography.Title level={5} className="!font-medium !text-sm !mb-0">
                  Sucursal
                </Typography.Title>
                <div className="flex items-center justify-between">
                  <Typography.Paragraph className="w-full !m-0" type="secondary">
                    Sucursal {(metadata as any)?.branches?.name || '- - -'}
                  </Typography.Paragraph>
                </div>
              </div>
            </CardRoot>
          )}
        </Col>
      </Row>
      {currentItem && <EditSaleItemModal currentItem={currentItem} open={open} onClose={closeModal} />}
    </div>
  );
};

const ALERT_COLORS: { [key: number]: AlertProps['type'] } = {
  4: 'success', // Completed
  5: 'warning', // Pending
  6: 'error', // Canceled
};

export default SaleDetail;
