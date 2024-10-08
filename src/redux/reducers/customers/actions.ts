import { AppDispatch, AppState } from '@/redux/store';
import { customerActions } from '.';
import { supabase } from '@/config/supabase';
import { Customer } from './types';
import { message } from 'antd';
import { FetchFunction } from '../products/actions';

const customActions = {
  fetchCustomers: (_?: FetchFunction) => async (dispatch: AppDispatch, getState: AppState) => {
    let customers = getState().customers.customers || [];
    const company_id = getState().app.company.company_id;
    dispatch(customerActions.setLoading(true));
    const { data, error } = await supabase.from('customers').select('*').eq('company_id', company_id);

    dispatch(customerActions.setLoading(false));
    if (error) {
      message.error('No se pudo obtener la información.', 4);
      return;
    }

    customers =
      data
        ?.map((item, key) => {
          return {
            ...item,
            key,
          } as Customer;
        })
        ?.sort((a, b) => a?.name?.localeCompare(b?.name)) ?? [];
    dispatch(customerActions.setCustomers(customers));
  },
  saveCustomer: (customer: Customer) => async (dispatch: AppDispatch, getState: AppState) => {
    try {
      dispatch(customerActions.setLoading(true));
      const company_id = getState().app.company.company_id;

      const { data, error } = await supabase
        .from('customers')
        .insert({
          name: customer.name,
          address: customer.address,
          email: customer.email,
          phone: customer.phone,
          company_id,
        } as Customer)
        .select()
        .single();

      dispatch(customerActions.setLoading(false));

      if (error) {
        if (error.message.includes('duplicate key value violates unique constraint')) {
          message.error('El cliente ya está registrado.', 4);
          return false;
        }
        message.error('No se pudo guardar la información.', 4);
        return false;
      }
      await dispatch(customActions.fetchCustomers({ refetch: true }));
      message.success('Cliente agregado con éxito!', 3);
      return data;
    } catch (error) {
      dispatch(customerActions.setLoading(false));
      return false;
    }
  },
  updateCustomer: (customer: Customer) => async (dispatch: AppDispatch, getState: AppState) => {
    try {
      dispatch(customerActions.setLoading(true));
      const company_id = getState().app.company.company_id;

      const oldData = getState().customers.current_customer;
      const newData = {
        name: customer.name,
        address: customer.address,
        email: customer.email,
        phone: customer.phone,
        company_id,
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
  deleteCustomerById: (customer_id: number) => async () => {
    const result = await supabase.from('customers').delete().eq('customer_id', customer_id);

    if (result?.error) {
      message.error('No se pudo eliminar la información.', 4);
      return false;
    }

    message.success('Cliente eliminado con éxito!', 4);
    return true;
  },
};

export default customActions;
