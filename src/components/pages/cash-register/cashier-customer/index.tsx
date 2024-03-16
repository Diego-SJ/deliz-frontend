import { UserAddOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Drawer, Select } from 'antd';
import CustomerEditor from '../../customers/editor';
import { useAppDispatch, useAppSelector } from '@/hooks/useStore';
import { customerActions } from '@/redux/reducers/customers';
import { Customer } from '@/redux/reducers/customers/types';
import { useCallback, useEffect, useState } from 'react';
import { salesActions } from '@/redux/reducers/sales';
import INITIAL_STATE from '@/constants/initial-states';
import functions from '@/utils/functions';

type Option = {
  value: number | string;
  label: string;
};

const CashierCustomer = () => {
  const dispatch = useAppDispatch();
  const [customerList, setCustomerList] = useState<Option[]>([]);
  const { current_customer, customers } = useAppSelector(({ customers }) => customers);
  const [currentCustomerId, setCurrentCustomerId] = useState<number | string>();
  const { cash_register } = useAppSelector(({ sales }) => sales);
  const { customer_id } = cash_register;

  useEffect(() => {
    let _customers = customers.map(item => ({ value: item.customer_id, label: item.name }));
    _customers.push({ value: '' as any, label: 'Selecciona un cliente' });
    setCustomerList(_customers);
  }, [customers]);

  useEffect(() => {
    setCurrentCustomerId(customer_id);
  }, [customer_id]);

  // const onMount = useCallback(() => {
  //   dispatch(salesActions.cashRegister.setCustomerId(INITIAL_STATE.customerId));
  // }, [dispatch]);

  // useEffect(() => {
  //   onMount();
  // }, [onMount]);

  const onChange = (customerId: number) => {
    setCurrentCustomerId(customerId);
    dispatch(salesActions.cashRegister.setCustomerId(customerId));
  };

  const onAddNew = () => {
    //dispatch(customerActions.fetchCustomers(true));
    dispatch(customerActions.setCurrentCustomer({ customer_id: -1 } as Customer));
  };

  const onClose = () => {
    dispatch(customerActions.setCurrentCustomer({} as Customer));
  };

  return (
    <div className="cashier-search" style={{ display: 'flex', gap: '10px' }}>
      <Select
        showSearch
        style={{ width: '100%' }}
        size="large"
        value={currentCustomerId as number}
        placeholder="Buscar cliente"
        virtual={false}
        suffixIcon={<UserOutlined rev={{}} />}
        optionFilterProp="children"
        onChange={onChange}
        filterOption={(input, option) => functions.includes(option?.label, input.toLowerCase())}
        options={customerList}
      />
      <Button icon={<UserAddOutlined rev={{}} />} shape="circle" size="large" type="primary" onClick={onAddNew} />
      <Drawer
        title="Agregar nuevo cliente"
        width={350}
        onClose={onClose}
        open={!!current_customer.customer_id}
        styles={{ body: { paddingBottom: 80 } }}
      >
        <CustomerEditor onSuccess={onClose} />
      </Drawer>
    </div>
  );
};

export default CashierCustomer;
