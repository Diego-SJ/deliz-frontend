import { ZONES } from '@/constants/zones';
import { Company } from '@/redux/reducers/app/types';
import { Branch } from '@/redux/reducers/branches/type';
import { CashOperation, OperationItem } from '@/redux/reducers/cashiers/types';
import { Product } from '@/redux/reducers/products/types';
import { SaleDetails } from '@/redux/reducers/sales/types';

export const cashierHelpers = {
  calculateAmounts: (operations: CashOperation[], sales: SaleDetails[]) => {
    let operationsList: OperationItem[] = operations?.map(
      item =>
        ({
          key: item.cash_operation_id,
          name: item.name,
          amount: item.amount,
          total: 0,
          operation_type: item.operation_type,
          payment_method: item.payment_method,
          created_at: item.created_at,
          cashier_id: item.cashier_id,
          user_id: item.user_id,
        } as OperationItem),
    );

    let salesList: OperationItem[] = sales?.map(
      (item: SaleDetails) =>
        ({
          key: item.sale_id?.toString(),
          name: item.customers?.name || 'Venta',
          amount: (item.amount_paid || 0) < (item.total || 0) ? item.amount_paid : item.total,
          total: item.total,
          operation_type: 'SALE',
          payment_method: item.payment_method,
          created_at: item.created_at,
          cashier_id: item.cashier_id as number,
          user_id: '',
        } as OperationItem),
    );

    return [...operationsList, ...salesList].sort(
      (a, b) => Number(new Date(b?.created_at || '')) - Number(new Date(a?.created_at || '')),
    );
  },
  getWhosalePrice: (product?: Product, zone?: number) => {
    if (!product) return 0;
    let _zone = zone || 1;
    return (product?.wholesale_price || 0) + ZONES[_zone][product?.category_id || 1][product?.size_id || 2];
  },
  isValidPhone: (phone: string) => {
    if (!phone || phone?.length !== 10) return false;
    let phoneClean = phone?.replace(/[\s-]/g, '')?.trim();
    let regex = /^[0-9]{10}$/;
    return regex.test(phoneClean);
  },
  getAddress: (branch: Branch) => {
    return `${branch?.street || 'Domicilio Conocido'} ${branch?.ext_number || 'S/N'}, ${branch?.city || 'México'}, ${
      branch?.zip_code || '000000'
    }`;
  },
};
