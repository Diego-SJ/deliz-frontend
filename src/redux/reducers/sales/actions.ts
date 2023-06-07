import { AppDispatch, AppState } from '@/redux/store';
import { salesActions } from '.';
import { supabase } from '@/config/supabase';
import { CashRegister, CashRegisterItem, DiscountType, Sale, SaleDetails, SaleItem } from './types';
import { v4 as uuidv4 } from 'uuid';
import { message } from 'antd';
import { FetchFunction } from '../products/actions';

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

        let items: SaleItem[] = data?.map(item => ({ ...item, key: item.sale_detail_id } as SaleItem)) || [];

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
  createSale:
    (sale: Sale) =>
    async (dispatch: AppDispatch, getState: AppState): Promise<Sale | null> => {
      try {
        dispatch(salesActions.setLoading(true));
        const state = getState().sales;
        let newSale: Sale = {
          ...sale,
          customer_id: state.cash_register.customer_id,
          discount: state.cash_register.discount,
          discount_type: state.cash_register.discountType,
          shipping: state.cash_register.shipping,
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
          } as SaleItem;
        });

        const { error, data } = await supabase.from('sale_detail').upsert(saleItems);
        console.log(data);
        if (error) {
          message.error('No se pudo registrar los productos de la venta');
          return false;
        }

        await dispatch(salesActions.fetchSales({ refetch: true }));
        message.success('¡Venta registrada!', 4);
        return true;
      } catch (error) {
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
        customer_id: 0,
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
};

export default customActions;
