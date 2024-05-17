import { CashOperation, OperationItem } from '@/redux/reducers/cashiers/types';
import { SaleDetails } from '@/redux/reducers/sales/types';

export const cashierHelpers = {
  calculateAmounts: (operations: CashOperation[], sales: SaleDetails[]) => {
    let operationsList: OperationItem[] = operations?.map(
      item =>
        ({
          key: item.cash_operation_id,
          name: item.name,
          amount: item.amount,
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
          amount: item.total || 0,
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
};
