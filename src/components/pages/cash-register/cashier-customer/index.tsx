import { CloseOutlined, SearchOutlined, TeamOutlined, UserAddOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Drawer, Select, Modal, Typography } from 'antd';
import CustomerEditor from '../../customers/editor';
import { useAppDispatch, useAppSelector } from '@/hooks/useStore';
import { customerActions } from '@/redux/reducers/customers';
import { Customer } from '@/redux/reducers/customers/types';
import { useEffect, useState } from 'react';
import { salesActions } from '@/redux/reducers/sales';
import functions from '@/utils/functions';
import useMediaQuery from '@/hooks/useMediaQueries';

type Option = {
  value: number | string;
  label: string;
} & Partial<Customer>;

const CashierCustomer = () => {
  const dispatch = useAppDispatch();
  const [customerList, setCustomerList] = useState<Option[]>([]);
  const { customers } = useAppSelector(({ customers }) => customers);
  const { permissions } = useAppSelector(({ users }) => users.user_auth.profile!);
  const [currentCustomerId, setCurrentCustomerId] = useState<number | string | null>();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const { cash_register } = useAppSelector(({ sales }) => sales);
  const [isCreating, setIsCreating] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const { customer_id } = cash_register;
  const [hoverDelete, setHoverDelete] = useState(false);
  const { isTablet } = useMediaQuery();

  useEffect(() => {
    let _customers: Option[] = customers.map(item => ({ value: item.customer_id, label: item.name, ...item }));
    setCustomerList(_customers);
  }, [customers]);

  useEffect(() => {
    setCurrentCustomerId(customer_id);
    setCustomer(customers.find(item => item.customer_id === customer_id) || null);
  }, [customer_id]);

  const onClose = () => {
    setIsCreating(false);
    setOpenForm(false);
  };

  const onChange = (customerId: number | null) => {
    console.log(customerId);
    dispatch(salesActions.cashRegister.setCustomerId(customerId));
    onClose();
  };

  const onAddNew = () => {
    if (hoverDelete) return;
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
              suffixIcon={<SearchOutlined />}
              optionFilterProp="children"
              className="xl-select"
              onChange={onChange}
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
                      <span className="text-slate-400 font-light">{option?.data?.phone}</span>{' '}
                    </div>
                  </div>
                );
              }}
            />
            <div
              onClick={() => onChange(null)}
              className="flex items-center px-2 py-2 gap-3 hover:bg-gray-50 cursor-pointer border rounded-lg my-2"
            >
              <Avatar shape="square" size="large" icon={<UserOutlined className="text-primary" />} className="bg-primary/10" />
              <div className="flex flex-col">Público General</div>
            </div>
            {permissions?.customers?.add_customer && (
              <div
                onClick={onRegister}
                className="flex items-center px-2 py-2 gap-3 hover:bg-gray-50 cursor-pointer border rounded-lg mb-3"
              >
                <Avatar
                  shape="square"
                  size="large"
                  icon={<UserAddOutlined className="text-green-600" />}
                  className="bg-green-600/10"
                />
                <div className="flex flex-col">Registra un cliente</div>
              </div>
            )}
          </>
        )}
      </>
    );
  };

  return (
    <>
      <div
        onClick={onAddNew}
        className="flex gap-2 items-center justify-between h-[45px] cursor-pointer hover:bg-gray-50 px-3 rounded-lg bg-white border border-gray-300 w-full"
      >
        <div className="flex gap-2 md:gap-5 items-center">
          <Avatar
            size="small"
            shape="square"
            className={`bg-primary/10 !text-lg`}
            icon={!!customer?.customer_id ? <UserOutlined className="text-primary" /> : <TeamOutlined className="text-primary" />}
          />
          <p className="leading-4 text-sm font-light m-0 !lowercase">
            {!!customer?.customer_id ? customer?.name : 'Público en general'}
          </p>
        </div>
        {!!customer?.customer_id && (
          <Button
            icon={<CloseOutlined />}
            size="small"
            onClick={() => {
              onChange(null);
              setHoverDelete(false);
            }}
            onMouseEnter={() => setHoverDelete(true)}
            onMouseLeave={() => setHoverDelete(false)}
          />
        )}
      </div>

      {!isTablet ? (
        <Modal
          title={<Typography.Title level={4}>Agregar cliente</Typography.Title>}
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
          title={<Typography.Title level={4}>Agregar cliente</Typography.Title>}
          width={350}
          styles={{ body: { paddingBottom: 80 } }}
        >
          <CUstomerForm />
        </Drawer>
      )}
    </>
  );
};

export default CashierCustomer;
