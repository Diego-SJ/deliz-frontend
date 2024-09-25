import { Branch, CashRegister } from '@/redux/reducers/branches/type';
import { MenuProps } from 'antd';

export const groupCashRegisters = (cashRegisters: CashRegister[], branches: Branch[]): MenuProps['items'] => {
  let data: MenuProps['items'] = [{ label: 'Todas las cajas', key: '' }];

  branches?.forEach(branch => {
    const cashRegistersFiltered = cashRegisters?.filter(cashRegister => cashRegister?.branch_id === branch?.branch_id) || [];

    data?.push({
      key: branch.branch_id,
      type: 'group',
      label: `Sucursal ${branch.name}`,
      children:
        cashRegistersFiltered?.map(cashRegister => ({
          key: cashRegister.cash_register_id,
          label: `Caja ${cashRegister.name}`,
        })) || [],
    });
  });

  return data;
};
