import { AppDispatch, AppState } from '@/redux/store';
import { customerActions } from '.';
import { supabase } from '@/config/supabase';
import { Customer } from './types';
import { message } from 'antd';
import { FetchFunction } from '../products/actions';

const customActions = {
  fetchCustomers: (args?: FetchFunction) => async (dispatch: AppDispatch, getState: AppState) => {
    try {
      dispatch(customerActions.setLoading(true));
      let customers = getState().customers.customers || [];

      if (!customers.length || args?.refetch) {
        const result = await supabase.from('customers').select('*');

        customers =
          result?.data
            ?.map((item, key) => {
              return {
                ...item,
                key,
              } as Customer;
            })
            ?.sort((a, b) => a?.name?.localeCompare(b?.name)) ?? [];
        dispatch(customerActions.setCustomers(customers));
      }

      dispatch(customerActions.setLoading(false));
    } catch (error) {
      message.error('No se pudo obtener la lista de clientes');
      dispatch(customerActions.setLoading(false));
      return false;
    }
  },
  saveCustomer: (customer: Customer) => async (dispatch: AppDispatch) => {
    try {
      dispatch(customerActions.setLoading(true));

      const result = await supabase.from('customers').insert({
        name: customer.name,
        address: customer.address,
        email: customer.email,
        phone: customer.phone,
      } as Customer);

      dispatch(customerActions.setLoading(false));

      if (result.error) {
        message.error('No se pudo guardar la información.', 4);
        return false;
      }
      await dispatch(customActions.fetchCustomers({ refetch: true }));
      message.success('Cliente agregado con éxito!', 4);
      return true;
    } catch (error) {
      dispatch(customerActions.setLoading(false));
      return false;
    }
  },
  updateCustomer: (customer: Customer) => async (dispatch: AppDispatch, getState: AppState) => {
    try {
      dispatch(customerActions.setLoading(true));

      const oldData = getState().customers.current_customer;
      const newData = {
        name: customer.name,
        address: customer.address,
        email: customer.email,
        phone: customer.phone,
      } as Customer;

      const result = await supabase.from('customers').update(newData).eq('customer_id', oldData.customer_id);

      dispatch(customerActions.setLoading(false));

      if (result.error) {
        message.error('No se pudo actualizar la información.', 4);
        return false;
      }

      await dispatch(customActions.fetchCustomers({ refetch: true }));
      dispatch(customerActions.setCurrentCustomer({ ...oldData, ...newData }));
      message.success('Cliente actualizado con éxito!', 4);
      return true;
    } catch (error) {
      dispatch(customerActions.setLoading(false));
      return false;
    }
  },
};

export default customActions;
