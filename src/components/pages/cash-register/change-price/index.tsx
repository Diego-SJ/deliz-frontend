import { useAppDispatch, useAppSelector } from '@/hooks/useStore';
import { Price } from '@/redux/reducers/branches/type';
import { salesActions } from '@/redux/reducers/sales';
import { DollarOutlined } from '@ant-design/icons';
import { App, Avatar, Modal, Typography } from 'antd';
import { useEffect, useState } from 'react';

const ChangePrice = () => {
  const dispatch = useAppDispatch();
  const { prices_list } = useAppSelector(({ branches }) => branches);
  const { cash_register } = useAppSelector(({ sales }) => sales);
  const { permissions } = useAppSelector(({ users }) => users.user_auth.profile!);
  const [currentPrice, setCurrentPrice] = useState<Price | null>(null);
  const { price_id } = cash_register;
  const [openForm, setOpenForm] = useState(false);
  const { modal } = App.useApp();

  useEffect(() => {
    if (!price_id) {
      let defaultPrice = prices_list.find(item => item.is_default);
      setCurrentPrice(defaultPrice as Price);
      dispatch(salesActions.cashRegister.changePrice(defaultPrice?.price_id || null));
    }
  }, [price_id, prices_list, dispatch]);

  useEffect(() => {
    if (price_id) {
      let defaultPrice = prices_list.find(item => item.price_id === price_id);
      setCurrentPrice(defaultPrice as Price);
    }
  }, [price_id]);

  const onClose = () => {
    setOpenForm(false);
  };

  const onAddNew = () => {
    if (!!permissions?.pos?.switch_prices?.value) setOpenForm(true);
  };

  return (
    <>
      <div
        onClick={onAddNew}
        className={`flex gap-2 items-center justify-between h-[45px] ${
          !!permissions?.pos?.switch_prices?.value ? 'cursor-pointer hover:bg-gray-50' : ''
        } px-3 rounded-lg bg-white border border-gray-300 w-full`}
      >
        <div className="flex gap-2 md:gap-5 items-center">
          <Avatar
            size="small"
            shape="square"
            className={`bg-green-600/10`}
            icon={<DollarOutlined className="text-green-600 !text-lg" />}
          />
          <p className="leading-4 text-sm font-light m-0 !lowercase">{currentPrice?.name}</p>
        </div>
      </div>

      <Modal
        title={<Typography.Title level={4}>Cambiar Precios</Typography.Title>}
        footer={null}
        width={400}
        onCancel={onClose}
        open={openForm}
      >
        {prices_list.map(item => (
          <div
            key={item.price_id}
            onClick={() => {
              modal.confirm({
                title: 'Se actualizará el precio de todos los productos',
                content: '¿Deseas continuar?',
                cancelText: 'Cancelar',
                type: 'warning',
                okText: 'Confirmar',
                onOk: async () => {
                  dispatch(salesActions.cashRegister.changePrice(item?.price_id || null));
                  onClose();
                },
              });
            }}
            className={`flex items-center px-2 py-2 gap-3 hover:bg-gray-50/90 cursor-pointer border rounded-lg my-2 ${
              item.price_id === price_id ? 'bg-gray-100' : ''
            }`}
          >
            <Avatar
              shape="square"
              size="large"
              icon={<DollarOutlined className="text-green-600" />}
              className="bg-green-600/10"
            />
            <div className="flex flex-col">{item.name}</div>
          </div>
        ))}
      </Modal>
    </>
  );
};

export default ChangePrice;
