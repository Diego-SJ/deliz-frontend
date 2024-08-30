import { EditOutlined, LoadingOutlined, SearchOutlined, UserAddOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Drawer, Select, Modal, Typography } from 'antd';
import { useAppDispatch, useAppSelector } from '@/hooks/useStore';
import { customerActions } from '@/redux/reducers/customers';
import { Customer } from '@/redux/reducers/customers/types';
import { useEffect, useState } from 'react';
import { salesActions } from '@/redux/reducers/sales';
import functions from '@/utils/functions';
import CustomerEditor from '@/components/pages/customers/editor';
import useMediaQuery from '@/hooks/useMediaQueries';

type Option = {
  value: number | string;
  label: string;
} & Partial<Customer>;

const ChangeCustomerModal = () => {
  const dispatch = useAppDispatch();
  const [customerList, setCustomerList] = useState<Option[]>([]);
  const { customers } = useAppSelector(({ customers }) => customers);
  const [currentCustomerId, setCurrentCustomerId] = useState<number | string | null>();
  const { current_sale } = useAppSelector(({ sales }) => sales);
  const [isCreating, setIsCreating] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const { isTablet } = useMediaQuery();

  useEffect(() => {
    let _customers: Option[] = customers.map(item => ({ value: item.customer_id, label: item.name, ...item }));
    setCustomerList(_customers);
  }, [customers]);

  useEffect(() => {
    setCurrentCustomerId(current_sale?.metadata?.customer_id || null);
  }, [current_sale]);

  const onClose = () => {
    setIsCreating(false);
    setOpenForm(false);
  };

  const onChange = async (customerId: number | null) => {
    if (loading) return;
    setCurrentCustomerId(customerId);
    setLoading(true);
    const result = await dispatch(
      salesActions.upsertSale({ customer_id: customerId || null, sale_id: current_sale.metadata?.sale_id }),
    );
    if (result) onClose();
    setLoading(false);
    onClose();
  };

  const onAddNew = () => {
    setOpenForm(true);
  };

  const onRegister = () => {
    setIsCreating(true);
    dispatch(customerActions.setCurrentCustomer({ customer_id: -1 }));
  };

  const CUstomerForm = () => {
    return (
      <>
        {isCreating ? (
          <CustomerEditor onSuccess={value => onChange(value?.customer_id || null)} />
        ) : (
          <>
            <Typography.Text type="secondary" className="block mb-4">
              Selecciona un cliente
            </Typography.Text>
            <Select
              showSearch
              style={{ width: '100%', height: 58 }}
              size="large"
              value={currentCustomerId as number}
              placeholder="Buscar cliente"
              virtual={false}
              suffixIcon={loading ? <LoadingOutlined /> : <SearchOutlined />}
              optionFilterProp="children"
              className="xl-select"
              onChange={onChange}
              disabled={loading}
              filterOption={(input, option) => {
                return (
                  functions.includes(option?.label, input.toLowerCase()) || functions.includes(option?.phone, input.toLowerCase())
                );
              }}
              options={customerList}
              optionRender={option => {
                if (option.value === '') return null;
                return (
                  <div className="flex items-center px-0 py-0 gap-4">
                    <Avatar shape="square" icon={<UserOutlined className="text-primary" />} className="bg-primary/10" />
                    <div className="flex flex-col">
                      <span className="font-normal text-base mb-0 lowercase">{option.label}</span>{' '}
                      <span className="text-slate-400 font-light">{option?.data?.phone || 'Sin número'}</span>{' '}
                    </div>
                  </div>
                );
              }}
            />
            <div
              onClick={() => onChange(null)}
              className="flex items-center px-2 py-2 gap-3 hover:bg-gray-50 cursor-pointer border rounded-lg my-2"
            >
              <Avatar
                shape="square"
                size="large"
                icon={loading ? <LoadingOutlined /> : <UserOutlined className="text-primary" />}
                className="bg-primary/10"
              />
              <div className="flex flex-col">Público General</div>
            </div>
            <div
              onClick={onRegister}
              className="flex items-center px-2 py-2 gap-3 hover:bg-gray-50 cursor-pointer border rounded-lg mb-3"
            >
              <Avatar
                shape="square"
                size="large"
                icon={loading ? <LoadingOutlined /> : <UserAddOutlined className="text-green-600" />}
                className="bg-green-600/10"
              />
              <div className="flex flex-col">Registra un cliente</div>
            </div>
          </>
        )}
      </>
    );
  };

  return (
    <>
      <Button shape="circle" size="large" className="!w-fit -mt-5" type="text" icon={<EditOutlined />} block onClick={onAddNew} />
      {!isTablet ? (
        <Modal
          title={<Typography.Title level={4}>Actualizar cliente</Typography.Title>}
          footer={null}
          width={400}
          destroyOnClose
          onCancel={onClose}
          open={openForm}
        >
          <CUstomerForm />
        </Modal>
      ) : (
        <Drawer
          open={openForm}
          onClose={onClose}
          placement="bottom"
          height="90dvh"
          title={<Typography.Title level={4}>Actualizar cliente</Typography.Title>}
          width={350}
          styles={{ body: { paddingBottom: 80 } }}
        >
          <CUstomerForm />
        </Drawer>
      )}
    </>
  );
};

export default ChangeCustomerModal;
