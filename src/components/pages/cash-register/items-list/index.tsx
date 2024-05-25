import { useState } from 'react';
import { Button } from 'antd';
import { CashRegisterItem } from '@/redux/reducers/sales/types';
import functions from '@/utils/functions';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '@/hooks/useStore';
import CashierModal from '../cashier-modal';
import { salesActions } from '@/redux/reducers/sales';

type DataType = CashRegisterItem;

const CashRegisterItemsList = () => {
  const dispatch = useAppDispatch();
  const { cash_register } = useAppSelector(({ sales }) => sales);
  const [open, setOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<CashRegisterItem>();

  const closeModal = () => {
    setOpen(false);
  };

  const openModal = (item: CashRegisterItem) => {
    setCurrentProduct(item);
    setOpen(!!item?.product?.name);
  };

  const onRemove = (item: CashRegisterItem) => {
    dispatch(salesActions.cashRegister.remove(item.key as string));
  };

  return (
    <div className="cashier-items h-[calc(100dvh-342px)] overflow-y-scroll">
      <div className="grid grid-cols-[70%_1fr] bg-gray-100 w-full px-4 py-2 justify-between border-b border-gray-200 md:rounded-lg">
        <span className="text-base font-medium w-full text-start">Producto</span>
        <span className="text-base font-medium text-center">Acciones</span>
      </div>
      <ul className="p-0 flex flex-col">
        {(cash_register?.items || []).map(record => {
          let product = record.product;
          let price = record.wholesale_price ? product.wholesale_price : product.retail_price;

          return (
            <li key={record.key} className="grid grid-cols-[70%_1fr] border-b border-gray-200">
              <div className="flex flex-col w-full justify-start pl-4 py-1 ">
                <div className="flex flex-col">
                  <span className="w-full text-start font-semibold">{record.product.name}</span>
                  <span className="w-full text-start text-slate-400 font-normal">
                    {record.product?.categories?.name || 'Item extra'}
                  </span>
                </div>
                <div className="flex gap-4 justify-between text-slate-600">
                  <span>
                    {record?.quantity} x {functions.money(price)}
                  </span>
                  <span className="pr-2">{functions.money(record?.quantity * price)}</span>
                </div>
              </div>
              <div className="w-full flex justify-center items-center gap-3">
                <Button shape="default" size="large" icon={<EditOutlined rev={{}} />} onClick={() => openModal(record)} />
                <Button shape="default" size="large" icon={<DeleteOutlined rev={{}} />} onClick={() => onRemove(record)} />
              </div>
            </li>
          );
        })}
      </ul>

      <CashierModal
        open={open}
        currentProduct={currentProduct?.product}
        casherItem={currentProduct}
        action="EDIT"
        onCancel={closeModal}
      />
    </div>
  );
};

export default CashRegisterItemsList;
