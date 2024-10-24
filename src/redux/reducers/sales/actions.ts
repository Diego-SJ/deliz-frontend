import { AppDispatch, AppState } from '@/redux/store';
import { salesActions } from '.';
import { supabase } from '@/config/supabase';
import {
  CashRegister,
  CashRegisterItem,
  DiscountType,
  OperatingExpense,
  Sale,
  SaleDetails,
  SaleItem,
  SaleRPC,
} from './types';
import { v4 as uuidv4 } from 'uuid';
import { message } from 'antd';
import { FetchFunction } from '../products/actions';
import { productActions } from '../products';
import { Product } from '../products/types';
import { productHelpers } from '@/utils/products';
import { STATUS_DATA } from '@/constants/status';
import dayjs from 'dayjs';

const customActions = {
  fetchSales: (args?: FetchFunction) => async (dispatch: AppDispatch, getState: AppState) => {
    let salesList: SaleRPC[] = getState().sales.sales || [];
    const company_id = getState().app.company.company_id;
    const { isAdmin, profile } = getState()?.users?.user_auth;
    const { currentBranch, currentCashRegister } = getState().branches;
    const { orderBy, branch_id = null, ...filters } = getState()?.sales?.filters?.sales || {};

    if (!salesList.length || args?.refetch) {
      dispatch(salesActions.setLoading(true));
      const supabaseQuery = supabase.rpc('fetch_sales', {
        company_id_param: company_id,
        status_ids_param: !filters?.status_id
          ? [STATUS_DATA.PAID.id, STATUS_DATA.PENDING.id, STATUS_DATA.CANCELED.id]
          : [filters?.status_id],
        branch_id_param:
          !isAdmin || (!!branch_id && branch_id !== 'ALL') ? branch_id || currentBranch?.branch_id : null,
        cash_register_ids_param: !isAdmin ? [currentCashRegister?.cash_register_id] : null,
        search_param: filters?.search || null,
        p_created_by: isAdmin ? null : profile?.permissions?.sales?.view_sales_created ? profile?.profile_id : null,
      });

      if (orderBy) {
        const [field, order] = orderBy.split(',');
        supabaseQuery.order(field, { ascending: order === 'asc' });
      } else {
        supabaseQuery.order('created_at', { ascending: false });
      }

      // pagination
      const page = filters?.page || 0;
      const pageSize = filters?.pageSize || 20;
      let offset = page * pageSize;
      let limit = (page + 1) * pageSize - 1;

      const { data, error } = await supabaseQuery.range(offset, limit);
      const totalRecords = data?.length ? data[0]?.full_count : 0;
      dispatch(salesActions.setLoading(false));

      if (error) {
        message.error('No se pudo cargar la lista de ventas');
        return false;
      }

      salesList = data as SaleRPC[];

      dispatch(
        salesActions.setSaleFilters({
          page: page,
          pageSize: pageSize,
          totalRecords,
        }),
      );
      dispatch(salesActions.setSales(salesList));
      return true;
    }
  },
  getSaleById: (args?: { sale_id?: number } & FetchFunction) => async (dispatch: AppDispatch, getState: AppState) => {
    try {
      const sale = getState().sales.current_sale;

      if (!sale.items?.length || args?.refetch) {
        dispatch(salesActions.setLoading(args?.startLoading ?? true));

        const [query1, query2] = await Promise.all([
          supabase
            .from('sale_detail')
            .select(
              `*,
              products (name, inventory, category_id, image_url, price_list, product_id, raw_price, categories (name, category_id))
            `,
            )
            .eq('sale_id', args?.sale_id)
            .order('created_at', { ascending: false }),
          supabase
            .from('sales')
            .select(
              `*,
              customers (name, customer_id, phone, address),
              status (status_id, name),
              branches (branch_id, name),
              cash_registers (cash_register_id, name),
              cash_cuts ( opening_date, closing_date ),
              profiles (first_name, last_name)
            `,
            )
            .eq('sale_id', args?.sale_id),
        ]);

        const { data, error } = query1;
        const { data: metadata } = query2;

        let items: SaleItem[] =
          data?.map((item) => {
            let product = { ...item?.products };
            if (item?.product_id === 0) {
              product = {
                ...product,
                name: item?.metadata?.name,
                categories: { ...product?.categories, name: 'Item extra' },
              } as Product;
            }
            return { ...item, products: product } as SaleItem;
          }) || [];

        let saleDetails: SaleDetails | undefined =
          metadata && metadata[0]
            ? ({
                ...metadata[0],
                amount_paid: metadata[0]?.status_id === STATUS_DATA.PAID.id ? metadata[0]?.amount_paid : 0,
              } as SaleDetails)
            : undefined;

        dispatch(salesActions.setCurrentSale({ items, metadata: saleDetails }));
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
  addItemToSale: (item: SaleItem) => async (dispatch: AppDispatch, getState: AppState) => {
    const branch_id = getState().branches.currentBranch?.branch_id;
    const { error } = await supabase.rpc('add_sale_item', {
      p_metadata: item.metadata || {},
      p_price: item?.price,
      p_product_id: item.product_id || null,
      p_quantity: item.quantity,
      p_sale_id: item.sale_id,
      p_branch_id: branch_id,
    });

    if (error) {
      message.error('No se pudo agregar el producto a la venta');
      return false;
    }

    await dispatch(salesActions.getSaleById({ refetch: true, sale_id: item.sale_id }));
  },
  createSale:
    (sale: Partial<Sale>) =>
    async (dispatch: AppDispatch, getState: AppState): Promise<Sale | null> => {
      try {
        dispatch(salesActions.setLoading(true));
        const state = getState();
        let { currentCashRegister, currentBranch } = getState().branches;
        let { company_id } = getState().app.company;

        const newSale = {
          amount_paid: sale.amount_paid || 0,
          branch_id: currentBranch?.branch_id!,
          cash_register_id: currentCashRegister?.cash_register_id!,
          cashback: sale.cashback || 0,
          company_id,
          customer_id: state?.sales?.cash_register.customer_id as number,
          discount: state?.sales?.cash_register.discount,
          discount_type: state?.sales?.cash_register.discountType || 'AMOUNT',
          payment_method: sale?.payment_method || 'CASH',
          shipping: state?.sales?.cash_register.shipping,
          status_id: sale.status_id || STATUS_DATA.PENDING.id,
          total: sale.total || 0,
          created_by: state?.users?.user_auth?.profile?.profile_id,
          created_at: dayjs().toISOString(),
        } as Sale;

        const { data, error } = await supabase
          .rpc('create_sale', {
            p_amount_paid: newSale.amount_paid,
            p_branch_id: newSale.branch_id,
            p_cash_register_id: newSale.cash_register_id,
            p_cashback: newSale.cashback,
            p_company_id: newSale.company_id,
            p_customer_id: newSale.customer_id,
            p_discount: newSale.discount,
            p_discount_type: newSale.discount_type,
            p_payment_method: newSale.payment_method,
            p_shipping: newSale.shipping,
            p_status_id: newSale.status_id,
            p_total: newSale.total,
            p_created_by: newSale.created_by,
          })
          .select()
          .single();
        dispatch(salesActions.setLoading(false));

        if (error) {
          message.error('No se pudo registrar la venta');
          return null;
        }

        return { ...newSale, sale_id: data.sale_id } as Sale;
      } catch (error) {
        dispatch(salesActions.setLoading(false));
        return null;
      }
    },
  upsertSale: (item: Partial<Sale>) => async (dispatch: AppDispatch) => {
    try {
      const { error } = await supabase
        .from('sales')
        .upsert({
          ...item,
          updated_at: dayjs().tz('America/Mexico_City').format(),
        })
        .eq('sale_id', item.sale_id)
        .single();

      if (error) {
        message.error('No se pudo actualizar la información.', 4);
        return false;
      }

      await dispatch(
        salesActions.getSaleById({
          refetch: true,
          sale_id: item.sale_id,
          startLoading: false,
        }),
      );
      message.success('¡Venta actualizada!', 4);
      return true;
    } catch (error) {
      dispatch(productActions.setLoading(false));
      return false;
    }
  },
  updateSale: (item: Sale) => async (dispatch: AppDispatch, getState: AppState) => {
    try {
      let newItem = { ...item, updated_at: dayjs().toISOString() };

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
    let _products = products?.filter((p) => p?.product_id !== 0);
    for (let p of _products) {
      await supabase.rpc('reduce_product_quantity', {
        p_id: p.product_id,
        p_quantity: p.quantity,
      });
    }
  },
  saveSaleItems:
    (sale: Sale) =>
    async (dispatch: AppDispatch, getState: AppState): Promise<boolean> => {
      const state = getState().sales.cash_register.items || [];
      const branch_id = getState().branches.currentBranch?.branch_id;
      const company_id = getState().app.company.company_id;

      let saleItems: SaleItem[] = state.map((item) => {
        return {
          sale_id: sale.sale_id,
          price: item.price,
          product_id: item.product?.product_id || null,
          quantity: item.quantity,
          wholesale: null,
          branch_id,
          metadata: {
            price_type: item.price_type,
            product_name: item.product?.name,
          },
        } as SaleItem;
      });

      const { error } = await supabase.from('sale_detail').upsert(saleItems);

      if (error) {
        message.error('No se pudo registrar los productos de la venta');
        return false;
      }

      const { data: products } = await supabase
        .from('products')
        .select(
          `product_id,name,inventory,image_url, category_id, code,sku,description,raw_price,price_list, categories(category_id,name)`,
        )
        .eq('company_id', company_id)
        .order('name', { ascending: true });

      dispatch(productActions.setProducts((products as unknown as Product[]) || []));
      return true;
    },
  updateSaleItem: (item: SaleItem) => async (dispatch: AppDispatch) => {
    try {
      let newItem = { ...item };

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

      await dispatch(
        salesActions.getSaleById({
          refetch: true,
          sale_id: sale?.metadata?.sale_id,
        }),
      );
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
    reset: () => async (dispatch: AppDispatch, getState: AppState) => {
      const { branch_id, price_id } = getState().sales.cash_register;
      const defaultCashRegisterValues: CashRegister = {
        items: [],
        discount: 0,
        discountMoney: 0,
        discountType: 'AMOUNT',
        shipping: 0,
        status: 5,
        branch_id: branch_id || null,
        price_id: price_id || null,
        customer_id: null,
      };
      dispatch(salesActions.updateCashRegister(defaultCashRegisterValues));
    },
    add: (newItem: Partial<CashRegisterItem>) => async (dispatch: AppDispatch, getState: AppState) => {
      const { customer_id = null, price_id = null } = getState().sales.cash_register;
      const price = productHelpers.getProductPrice(newItem.product as Product, price_id);
      let currentItems = [...(getState().sales.cash_register?.items || [])];

      let newItemData: CashRegisterItem = {
        id: uuidv4(),
        customer_id,
        price,
        product: newItem.product as Product,
        quantity: newItem.quantity || 1,
        price_type: newItem.price_type || 'DEFAULT',
      };

      const itemDefaultExists = currentItems.findIndex((item) => {
        return item.product?.product_id === newItem.product?.product_id && item.price_type === 'DEFAULT';
      });

      if (itemDefaultExists >= 0) {
        newItemData.quantity = currentItems[itemDefaultExists].quantity + newItemData.quantity;
        currentItems.splice(itemDefaultExists, 1);
      }

      currentItems.unshift(newItemData);

      dispatch(salesActions.updateCashRegister({ items: currentItems }));
    },
    remove: (id: string) => async (dispatch: AppDispatch, getState: AppState) => {
      let items = getState().sales.cash_register?.items ?? [];
      items = items.filter((item) => item.id !== id);
      dispatch(salesActions.updateCashRegister({ items }));
    },
    update: (newItem: Partial<CashRegisterItem>) => async (dispatch: AppDispatch, getState: AppState) => {
      if (!newItem?.id) {
        dispatch(salesActions.cashRegister.add(newItem));
      } else {
        let items = [...(getState().sales.cash_register?.items ?? [])];
        let index = items.findIndex((item) => item.id === newItem.id);
        items.splice(index, 1, { ...(newItem as CashRegisterItem) });
        dispatch(salesActions.updateCashRegister({ items }));
      }
    },
    changePrice: (price_id: string | null) => async (dispatch: AppDispatch, getState: AppState) => {
      let items = [...(getState().sales.cash_register?.items ?? [])];

      items = items.map((item) => {
        let price = productHelpers.getProductPrice(item.product as Product, price_id);
        return { ...item, price, price_type: 'DEFAULT' };
      });

      dispatch(salesActions.updateCashRegister({ items, price_id: price_id }));
    },
    applyShipping: (shipping: number) => async (dispatch: AppDispatch) => {
      dispatch(salesActions.updateCashRegister({ shipping }));
    },
    applyDiscount:
      (discount: number, discountType: DiscountType) => async (dispatch: AppDispatch, getState: AppState) => {
        let items = [...(getState().sales.cash_register?.items ?? [])]?.filter(Boolean);
        let subtotal = items?.reduce((total, item) => {
          let productPrice = item.price;
          productPrice = productPrice * item.quantity;
          return productPrice + total;
        }, 0);
        let discountMoney = 0;

        if (discountType === 'AMOUNT') discountMoney = discount;
        else {
          // PERCENTAGE
          discountMoney = (subtotal * discount) / 100;
        }

        dispatch(
          salesActions.updateCashRegister({
            discount,
            discountType,
            discountMoney,
          }),
        );
      },
    setCustomerId: (customer_id: number | null) => async (dispatch: AppDispatch) => {
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

        let data =
          result?.map(
            (item) =>
              ({
                ...item,
                key: item.expense_id as number,
              }) as OperatingExpense,
          ) ?? [];
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
};

export default customActions;
