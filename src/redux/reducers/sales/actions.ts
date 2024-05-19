import { AppDispatch, AppState } from '@/redux/store';
import { salesActions } from '.';
import { supabase } from '@/config/supabase';
import {
  CashClosing,
  CashRegister,
  CashRegisterItem,
  Cashier,
  DiscountType,
  OperatingExpense,
  Sale,
  SaleDetails,
  SaleItem,
} from './types';
import { v4 as uuidv4 } from 'uuid';
import { message } from 'antd';
import { FetchFunction } from '../products/actions';
import { productActions } from '../products';
import { STATUS_OBJ } from '@/constants/status';
import { Product } from '../products/types';
import INITIAL_STATE from '@/constants/initial-states';
import { isToday } from 'date-fns';
import functions from '@/utils/functions';

const customActions = {
  fetchSales: (args?: FetchFunction) => async (dispatch: AppDispatch, getState: AppState) => {
    try {
      let salesList: SaleDetails[] = getState().sales.sales || [];

      if (!salesList.length || args?.refetch) {
        dispatch(salesActions.setLoading(true));
        const { data, error } = await supabase.from('sales').select(`
          *,
          customers ( * ),
          status ( status_id, name )
        `);

        dispatch(salesActions.setLoading(false));

        if (error) {
          message.error('No se pudo cargar la lista de ventas');
          return false;
        }

        salesList = data?.map(item => ({ ...item, key: item?.sale_id } as SaleDetails)) || [];
        salesList = salesList?.sort((a, b) => Number(new Date(b?.created_at)) - Number(new Date(a?.created_at)));

        dispatch(salesActions.setSales(salesList as SaleDetails[]));
        return true;
      }
    } catch (error) {
      dispatch(salesActions.setLoading(false));
      return false;
    }
  },
  getSaleById: (args?: { sale_id?: number; refetch?: boolean }) => async (dispatch: AppDispatch, getState: AppState) => {
    try {
      const sale = getState().sales.current_sale;

      if (!sale.items?.length || args?.refetch) {
        dispatch(salesActions.setLoading(true));
        const { data, error } = await supabase
          .from('sale_detail')
          .select('*, products (*, categories (*))')
          .eq('sale_id', args?.sale_id);

        let items: SaleItem[] =
          data?.map((item, key) => {
            let product = { ...item?.products };
            if (item?.product_id === 0) {
              product = {
                ...product,
                name: item?.metadata?.name,
                categories: { ...product?.categories, name: 'Item extra' },
              } as Product;
            }
            return { ...item, key, products: product } as SaleItem;
          }) || [];

        dispatch(salesActions.setCurrentSale({ items }));
        dispatch(salesActions.setLoading(false));

        if (error) {
          message.error('No se pudo cargar el detalle de esta venta');
          return false;
        }

        return true;
      }
    } catch (error) {
      dispatch(salesActions.setLoading(false));
      return false;
    }
  },
  addItemToSale: (item: SaleItem) => async (dispatch: AppDispatch) => {
    const { error } = await supabase.rpc('add_sale_item', {
      p_metadata: item.metadata || {},
      p_price: item?.price,
      p_product_id: item.product_id,
      p_quantity: item.quantity,
      p_sale_id: item.sale_id,
      p_wholesale: item.wholesale,
    });

    if (error) {
      message.error('No se pudo agregar el producto a la venta');
      return false;
    }

    await dispatch(salesActions.getSaleById({ refetch: true, sale_id: item.sale_id }));
  },
  createSale:
    (sale: Sale) =>
    async (dispatch: AppDispatch, getState: AppState): Promise<Sale | null> => {
      try {
        dispatch(salesActions.setLoading(true));
        const state = getState().sales;
        let activeCashier = await dispatch(salesActions.cashiers.getActiveCashier());
        let newSale: Sale = {
          ...sale,
          customer_id: state.cash_register.customer_id as number,
          discount: state.cash_register.discount,
          discount_type: state.cash_register.discountType,
          shipping: state.cash_register.shipping,
          cashier_id: activeCashier?.cashier_id,
        };

        const { data, error } = await supabase.from('sales').insert(newSale).select();
        dispatch(salesActions.setLoading(false));

        if (error) {
          message.error('No se pudo registrar la venta');
          return null;
        }
        message.success('Venta creada.', 4);
        return data[0] as Sale;
      } catch (error) {
        dispatch(salesActions.setLoading(false));
        return null;
      }
    },
  upsertSale: (item: Sale) => async (dispatch: AppDispatch, getState: AppState) => {
    try {
      let newItem = { ...item, updated_at: new Date() };
      delete newItem.key;

      const result = await supabase.from('sales').upsert(newItem).eq('sale_id', newItem.sale_id);

      if (result.error) {
        message.error('No se pudo actualizar la información.', 4);
        return false;
      }

      const { current_sale } = getState()?.sales;

      let newMetadata = {
        ...current_sale.metadata,
        ...(newItem as SaleDetails),
        status: { status_id: item.status_id as number, name: STATUS_OBJ[item.status_id as number].name },
      };
      await dispatch(salesActions.setCurrentSale({ metadata: newMetadata }));
      await dispatch(salesActions.fetchSales({ refetch: true }));

      message.success('¡Venta actualizada!', 4);
      return true;
    } catch (error) {
      dispatch(productActions.setLoading(false));
      return false;
    }
  },
  updateSale: (item: Sale) => async (dispatch: AppDispatch, getState: AppState) => {
    try {
      let newItem = { ...item, updated_at: new Date() };

      const result = await supabase.from('sales').update(newItem).eq('sale_id', item?.sale_id).select();

      if (result.error) {
        message.error('No se pudo actualizar la información.', 4);
        return false;
      }

      const { current_sale } = getState()?.sales;

      let newMetadata = {
        ...current_sale.metadata,
        ...(newItem as SaleDetails),
      };
      await dispatch(salesActions.setCurrentSale({ metadata: newMetadata }));
      await dispatch(salesActions.fetchSales({ refetch: true }));

      message.success('¡Venta actualizada!', 4);
      return true;
    } catch (error) {
      dispatch(productActions.setLoading(false));
      return false;
    }
  },
  restProductsStock: async (products: SaleItem[]) => {
    let _products = products?.filter(p => p?.product_id !== 0);
    for (let p of _products) {
      const { data, error } = await supabase.rpc('reduce_product_quantity', {
        p_id: p.product_id,
        p_quantity: p.quantity,
      });
    }
  },
  saveSaleItems:
    (sale: Sale) =>
    async (dispatch: AppDispatch, getState: AppState): Promise<boolean> => {
      try {
        message.info('Registrando productos', 4);
        const state = getState().sales.cash_register.items || [];

        let saleItems: SaleItem[] = state.map(item => {
          return {
            sale_id: sale.sale_id,
            price: item.wholesale_price ? item.product.wholesale_price : item.product.retail_price,
            product_id: item.product.product_id,
            quantity: item.quantity,
            wholesale: item.wholesale_price,
            metadata: item?.product?.product_id === 0 ? { name: item?.product?.name } : {},
          } as SaleItem;
        });

        const { error } = await supabase.from('sale_detail').upsert(saleItems);

        if (!error) {
          await salesActions.restProductsStock(saleItems);
        }

        if (error) {
          message.error('No se pudo registrar los productos de la venta');
          return false;
        }

        await dispatch(salesActions.fetchSales({ refetch: true }));
        await dispatch(productActions.fetchProducts({ refetch: true }));
        message.success('¡Venta registrada!', 4);
        return true;
      } catch (error) {
        return false;
      }
    },
  updateSaleItem: (item: SaleItem) => async (dispatch: AppDispatch) => {
    try {
      let newItem = { ...item };
      delete newItem.products;
      delete newItem.key;

      const result = await supabase.rpc('update_product_in_sale', {
        p_new_price: newItem?.price,
        p_new_quantity: newItem?.quantity,
        p_sale_detail_id: newItem?.sale_detail_id,
        p_sale_id: newItem?.sale_id,
      });

      if (result.error) {
        message.error('No se pudo actualizar la información.', 4);
        return false;
      }

      await dispatch(salesActions.getSaleById({ refetch: true, sale_id: newItem.sale_id }));
      message.success('¡Producto actualizado con éxito!', 4);
      return true;
    } catch (error) {
      dispatch(productActions.setLoading(false));
      return false;
    }
  },
  deleteItemById: (id: number) => async (dispatch: AppDispatch, getState: AppState) => {
    try {
      const sale = getState().sales.current_sale;
      const result = await supabase.rpc('remove_product_from_sale', {
        p_sale_detail_id: id,
        p_sale_id: sale?.metadata?.sale_id,
      });

      if (result.error) {
        message.error('No se pudo eliminar el producto de la venta.', 4);
        return false;
      }

      await dispatch(salesActions.getSaleById({ refetch: true, sale_id: sale?.metadata?.sale_id }));
      message.success('¡Producto eliminado con éxito!', 4);
      return true;
    } catch (error) {
      dispatch(productActions.setLoading(false));
      return false;
    }
  },
  deleteSaleById: (id: number) => async (dispatch: AppDispatch, getState: AppState) => {
    try {
      const result = await supabase.from('sales').delete().eq('sale_id', id);

      if (result.error) {
        message.error('No se pudo eliminar la venta.', 4);
        return false;
      }

      await dispatch(salesActions.fetchSales({ refetch: true }));
      message.success('¡Venta eliminada con éxito!', 4);
      return true;
    } catch (error) {
      dispatch(productActions.setLoading(false));
      return false;
    }
  },
  cashRegister: {
    reset: () => async (dispatch: AppDispatch) => {
      const defaultCashRegisterValues: CashRegister = {
        items: [],
        discount: 0,
        discountMoney: 0,
        discountType: 'AMOUNT',
        shipping: 0,
        status: 5,
        customer_id: INITIAL_STATE.customerId,
      };
      dispatch(salesActions.updateCashRegister(defaultCashRegisterValues));
    },
    add: (newItem: CashRegisterItem) => async (dispatch: AppDispatch, getState: AppState) => {
      const customer_id = getState().sales.cash_register?.customer_id as number;

      let items = [...(getState().sales.cash_register?.items ?? []), { ...newItem, key: uuidv4(), customer_id }].filter(Boolean);
      dispatch(salesActions.updateCashRegister({ items }));
    },
    remove: (key: string) => async (dispatch: AppDispatch, getState: AppState) => {
      let items = getState().sales.cash_register?.items ?? [];
      items = items.filter(item => item.key !== key);
      dispatch(salesActions.updateCashRegister({ items }));
    },
    update: (newItem: CashRegisterItem) => async (dispatch: AppDispatch, getState: AppState) => {
      let items = [...(getState().sales.cash_register?.items ?? [])]?.filter(Boolean);
      let index = items.findIndex(item => item.key === newItem.key);
      items.splice(index, 1, { ...newItem });
      dispatch(salesActions.updateCashRegister({ items }));
    },
    applyShipping: (shipping: number) => async (dispatch: AppDispatch) => {
      dispatch(salesActions.updateCashRegister({ shipping }));
    },
    applyDiscount: (discount: number, discountType: DiscountType) => async (dispatch: AppDispatch, getState: AppState) => {
      let items = [...(getState().sales.cash_register?.items ?? [])]?.filter(Boolean);
      let subtotal = items?.reduce((total, item) => {
        let productPrice = item.wholesale_price ? item.product.wholesale_price : item.product.retail_price;
        productPrice = productPrice * item.quantity;
        return productPrice + total;
      }, 0);
      let discountMoney = 0;

      if (discountType === 'AMOUNT') discountMoney = discount;
      else {
        // PERCENTAGE
        discountMoney = (subtotal * discount) / 100;
      }

      dispatch(salesActions.updateCashRegister({ discount, discountType, discountMoney }));
    },
    setCustomerId: (customer_id: number) => async (dispatch: AppDispatch) => {
      dispatch(salesActions.updateCashRegister({ customer_id }));
    },
  },
  closeDay: (comment?: string) => async (dispatch: AppDispatch, getState: AppState) => {
    let { data, error } = await supabase.rpc('close_today_sales', {
      comments: comment || 'Cierre del dia',
    });

    if (error) {
      message.error('No se pudo finalizar la operación');
      return false;
    }

    let newData = [...(getState()?.sales?.closing_days?.data || [])];
    newData?.unshift(data);
    dispatch(salesActions.setClosingDays({ data: newData, today_is_done: true }));

    message.success('Información guardada con exito');
    return true;
  },
  fetchClosedDays: (args?: FetchFunction) => async (dispatch: AppDispatch, getState: AppState) => {
    let salesList: CashClosing[] = getState().sales?.closing_days?.data || [];

    if (!salesList.length || args?.refetch) {
      let { data, error } = await supabase.from('cash_closing').select('*').order('created_at', { ascending: false });

      if (error) {
        message.error('No se pudo obtener la lista de registros');
        return false;
      }

      salesList = data || [];
    }

    let todayIsDone = salesList?.some(i => (i?.closing_date ? isToday(new Date(functions.date(i.closing_date))) : false));
    dispatch(salesActions.setClosingDays({ data: salesList as CashClosing[], today_is_done: todayIsDone }));
    return true;
  },
  operating_expenses: {
    get: (args: FetchFunction) => async (dispatch: AppDispatch, getState: AppState) => {
      try {
        let operating_expenses = getState()?.sales?.operating_expenses;

        if (!!operating_expenses?.data?.length && !args?.refetch) return true;

        dispatch(salesActions.setLoading(true));
        let { data: result, error } = await supabase.from('operating_expenses').select('*'); //.range(0, 9);
        dispatch(salesActions.setLoading(false));

        if (error) {
          message.error('No se pudo cargar esta información', 4);
          return false;
        }

        let data = result?.map(item => ({ ...item, key: item.expense_id as number } as OperatingExpense)) ?? [];
        data = data?.sort((a, b) => Number(new Date(b?.created_at || '')) - Number(new Date(a?.created_at || '')));

        dispatch(salesActions.setExpense({ data }));
        return true;
      } catch (error) {
        dispatch(salesActions.setLoading(false));
        return false;
      }
    },
    add: (expense: OperatingExpense) => async (dispatch: AppDispatch) => {
      try {
        dispatch(salesActions.setLoading(true));
        const { error } = await supabase
          .from('operating_expenses')
          .insert([
            {
              expense_name: expense.expense_name,
              description: expense.description,
              amount: expense.amount,
              payment_method: expense.payment_method,
              months_without_interest: expense.months_without_interest ?? 0,
            },
          ])
          .select();
        dispatch(salesActions.setLoading(false));

        if (error) {
          message.error('No se pudo guardar el registro.', 4);
          return false;
        }

        await dispatch(salesActions.operating_expenses.get({ refetch: true }));
        message.success('Registro agregado', 4);
        return true;
      } catch (error) {
        dispatch(salesActions.setLoading(false));
        return false;
      }
    },
    delete: (expense_id: number) => async (dispatch: AppDispatch) => {
      try {
        dispatch(salesActions.setLoading(true));
        const { error } = await supabase.from('operating_expenses').delete().eq('expense_id', expense_id);
        dispatch(salesActions.setLoading(false));

        if (error) {
          message.error(`No se pudo eliminar este elemento: ${error.message}`);
          return false;
        }

        dispatch(salesActions.operating_expenses.get({ refetch: true }));
        message.success('Elemento eliminado');
      } catch (error) {
        message.error('No se pudo eliminar este elemento');
        dispatch(salesActions.setLoading(false));
        return false;
      }
    },
    update: (expense: OperatingExpense) => async (dispatch: AppDispatch) => {
      try {
        dispatch(salesActions.setLoading(true));
        const { error } = await supabase
          .from('operating_expenses')
          .update({
            expense_name: expense.expense_name,
            description: expense.description,
            amount: expense.amount,
            payment_method: expense.payment_method,
            months_without_interest: expense.months_without_interest ?? 0,
          })
          .eq('expense_id', expense.expense_id)
          .select();
        dispatch(salesActions.setLoading(false));

        if (error) {
          message.error('No se pudo actualizar el registro.', 4);
          return false;
        }

        await dispatch(salesActions.operating_expenses.get({ refetch: true }));
        message.success('Registro actualizado', 4);
        return true;
      } catch (error) {
        message.error('No se pudo actualizar el registro.', 4);
        dispatch(salesActions.setLoading(false));
        return false;
      }
    },
    edit: (expense: OperatingExpense) => async (dispatch: AppDispatch) => {
      dispatch(salesActions.setExpense({ selected: expense, drawer: 'edit' }));
    },
  },
  cashiers: {
    get: (args: FetchFunction) => async (dispatch: AppDispatch, getState: AppState) => {
      try {
        let cashiers = getState()?.sales?.cashiers;

        if (!!cashiers?.data?.length && !args?.refetch) return true;

        dispatch(salesActions.setLoading(true));
        let { data: result, error } = await supabase.from('cashiers').select('*'); //.range(0, 9);
        dispatch(salesActions.setLoading(false));

        if (error) {
          message.error('No se pudo cargar esta información', 4);
          return false;
        }

        let data = result?.map(item => ({ ...item, key: item.cashier_id as number } as Cashier)) ?? [];
        data = data?.sort((a, b) => Number(new Date(b?.created_at || '')) - Number(new Date(a?.created_at || '')));
        let activeCashier = (result as Cashier[])?.filter(item => !!item?.is_open)[0] || null;

        dispatch(salesActions.setCashiers({ data, activeCashier }));
        return data;
      } catch (error) {
        dispatch(salesActions.setLoading(false));
        return false;
      }
    },
    add: (cashier: Cashier) => async (dispatch: AppDispatch) => {
      try {
        dispatch(salesActions.setLoading(true));
        const { data, error } = await supabase
          .from('cashiers')
          .insert([
            {
              name: cashier?.name || '',
              initial_amount: cashier.initial_amount || 0,
              final_amount: cashier.final_amount,
              close_date: null,
              is_open: true,
              branch_id: '81a16d60-40a5-4dba-a3c1-bc9372240bae',
            },
          ])
          .select();
        dispatch(salesActions.setLoading(false));

        if (error) {
          message.error('No se pudo guardar el registro.', 4);
          return false;
        }

        dispatch(salesActions.setCashiers({ activeCashier: data[0] as Cashier }));
        await dispatch(salesActions.cashiers.get({ refetch: true }));
        message.success('Registro agregado', 4);
        return true;
      } catch (error) {
        dispatch(salesActions.setLoading(false));
        return false;
      }
    },
    delete: (cashier_id: number) => async (dispatch: AppDispatch) => {
      try {
        dispatch(salesActions.setLoading(true));
        const { error } = await supabase.from('cashiers').delete().eq('cashier_id', cashier_id);
        dispatch(salesActions.setLoading(false));

        if (error) {
          message.error(`No se pudo eliminar este elemento: ${error.message}`);
          return false;
        }

        dispatch(salesActions.cashiers.get({ refetch: true }));
        message.success('Elemento eliminado');
      } catch (error) {
        message.error('No se pudo eliminar este elemento');
        dispatch(salesActions.setLoading(false));
        return false;
      }
    },
    update: (cashier: Cashier) => async (dispatch: AppDispatch) => {
      try {
        dispatch(salesActions.setLoading(true));
        const { error } = await supabase
          .from('cashiers')
          .update({ ...cashier, received_amount: cashier.received_amount })
          .eq('cashier_id', cashier.cashier_id);
        dispatch(salesActions.setLoading(false));

        if (error) {
          message.error('No se pudo actualizar el registro.', 4);
          return false;
        }

        await dispatch(salesActions.cashiers.get({ refetch: true }));
        message.success('Registro actualizado', 4);
        return true;
      } catch (error) {
        message.error('No se pudo actualizar el registro.', 4);
        dispatch(salesActions.setLoading(false));
        return false;
      }
    },
    edit: (cashier: Cashier) => async (dispatch: AppDispatch) => {
      dispatch(salesActions.setCashiers({ selected: cashier, drawer: 'edit' }));
    },
    closeDay: (receivedAmount: number) => async (dispatch: AppDispatch) => {
      try {
        dispatch(salesActions.setLoading(true));

        let { error } = await supabase.rpc('close_current_cashier', {
          p_branch_id: '81a16d60-40a5-4dba-a3c1-bc9372240bae',
          p_cashier_id: 0,
          p_received_amount: receivedAmount,
        });
        dispatch(salesActions.setLoading(false));

        if (error) {
          message.error('No se pudo actualizar el registro.', 4);
          return false;
        }

        await dispatch(salesActions.cashiers.get({ refetch: true }));
        message.success('Caja cerrada con exito', 4);
        return true;
      } catch (error) {
        message.error('No se pudo actualizar el registro.', 4);
        dispatch(salesActions.setLoading(false));
        return false;
      }
    },
    getActiveCashier:
      () =>
      async (dispatch: AppDispatch): Promise<Cashier | null> => {
        let { data: cashiers, error } = await supabase
          .from('cashiers')
          .select('*')
          .eq('is_open', true)
          .eq('branch_id', '81a16d60-40a5-4dba-a3c1-bc9372240bae');

        if (error) {
          message.error('No se pudo obtener la caja actual', 4);
          return null;
        }

        let activeCashier = cashiers ? (cashiers[0] as Cashier) : ({} as Cashier);
        dispatch(salesActions.setCashiers({ activeCashier }));

        return activeCashier;
      },
  },
};

export default customActions;
