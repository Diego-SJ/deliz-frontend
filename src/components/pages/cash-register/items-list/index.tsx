import React, { useState } from 'react';
import { Button, Space, Table } from 'antd';
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
    setOpen(true);
  };

  const onRemove = (item: CashRegisterItem) => {
    dispatch(salesActions.cashRegister.remove(item.key as string));
  };

  return (
    <div className="cashier-items">
      <Table
        columns={[
          {
            title: 'Producto',
            dataIndex: 'product',
            key: '1',

            render: (_, record: DataType) => <span>{record.product.name}</span>,
          },
          {
            title: 'Cant.',
            dataIndex: 'quantity',
            key: '3',
            align: 'center',
          },
          {
            title: '$',
            dataIndex: 'product',
            key: '2',
            align: 'center',
            render: (_, record: DataType) => {
              let product = record.product;
              let price = record.wholesale_price ? product.wholesale_price : product.retail_price;
              return functions.money(price);
            },
          },
          {
            title: 'Total',
            dataIndex: 'product',
            key: '4',
            align: 'center',
            render: (_, record: DataType) => {
              let product = record.product;
              let price = record.wholesale_price ? product.wholesale_price : product.retail_price;
              return functions.money(price * record.quantity);
            },
          },
          {
            title: 'Action',
            key: 'action',
            align: 'center',
            render: (_, record) => (
              <Space size="small">
                <Button shape="circle" icon={<EditOutlined rev={{}} />} onClick={() => openModal(record)} />
                <Button shape="circle" icon={<DeleteOutlined rev={{}} onClick={() => onRemove(record)} />} />
              </Space>
            ),
          },
        ]}
        dataSource={cash_register?.items}
        scroll={{ y: 'calc(100vh - 410px)' }}
        size="small"
        pagination={false}
      />

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
