import { useCallback, useState } from 'react';
import { Avatar, Button, InputNumber, Tag, Typography } from 'antd';
import { CashRegisterItem } from '@/redux/reducers/sales/types';
import functions from '@/utils/functions';
import { CloseOutlined, DollarCircleOutlined, FileImageOutlined, SignatureOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '@/hooks/useStore';
import CashierModal from '../cashier-modal';
import { salesActions } from '@/redux/reducers/sales';
import { AvatarProps } from '@/components/molecules/Avatar/types';
import useMediaQuery from '@/hooks/useMediaQueries';

const CashRegisterItemsList = () => {
  const dispatch = useAppDispatch();
  const { cash_register } = useAppSelector(({ sales }) => sales);
  const [open, setOpen] = useState(false);
  const [inputHovered, setInputHovered] = useState(false);
  const { isTablet } = useMediaQuery();
  const [currentProduct, setCurrentProduct] = useState<CashRegisterItem>();

  const closeModal = () => {
    setOpen(false);
  };

  const openModal = useCallback(
    (item: CashRegisterItem) => {
      if (!inputHovered) {
        setCurrentProduct(item);
        setOpen(!!item?.product?.name);
      }
    },
    [inputHovered],
  );

  const onRemove = (item: CashRegisterItem) => {
    dispatch(salesActions.cashRegister.remove(item.id));
  };

  return (
    <div className="cashier-items min-h-[calc(100dvh-400px)] max-h-[calc(100dvh-400px)] md:min-h-[calc(100dvh-290px)] md:max-h-[calc(100dvh-290px)] overflow-y-scroll">
      <ul className="px-3 py-2 md:px-0 md:py-0 flex flex-col">
        {(cash_register?.items || []).map(record => {
          const avatarProps = {
            shape: 'square',
            src: record.product?.image_url,
            icon: record?.product?.product_id ? (
              <FileImageOutlined className="text-slate-400 my-auto text-xl" />
            ) : (
              <SignatureOutlined className="text-slate-400 my-auto text-xl" />
            ),
          } as AvatarProps;

          return (
            <li
              onClick={() => openModal(record)}
              key={record.id}
              className="relative flex gap-2 my-1 md:my-0 rounded-lg md:rounded-none bg-white sm:gap-3 py-1 pl-3 max-md:border max-md:border-x-gray-300 border-b border-gray-200 min-h-[5.2rem] sm:hover:bg-gray-50/80 cursor-pointer"
            >
              <Avatar
                {...avatarProps}
                className="w-11 h-11 min-w-11 bg-slate-100 p-1 my-auto select-none  max-sm:hidden sm:grid sm:place-content-center"
              />

              <div className="max-sm:flex-col md:flex-col lg:flex-row flex flex-row w-full items-center py-1 xl:gap-8">
                <div className="flex flex-col w-full">
                  <Typography.Paragraph
                    ellipsis={{ rows: 2, tooltip: record.product?.name }}
                    className="text-start !font-medium !m-0 !mb-0 sm:!mb-1 w-full leading-4 select-none"
                  >
                    {record?.product?.name || 'Sin nombre'}
                  </Typography.Paragraph>
                  <p className="text-slate-400 font-light select-none leading-4">
                    {record?.price_type === 'PERSONALIZED' ? (
                      <Tag
                        icon={<DollarCircleOutlined className="text-primary" />}
                        bordered={false}
                        className="bg-primary/10 text-primary max-sm:mb-2 my-1 select-none"
                      >
                        personalizado {functions.money(record.price)}
                      </Tag>
                    ) : (
                      <span className="text-sm !font-light block my-1">{functions.money(record.price)}</span>
                    )}
                  </p>
                </div>

                <div className="flex max-sm:justify-between w-full max-sm:mt-0 md:mt-1 lg:mt-0  sm:justify-center md:justify-between lg:justify-center">
                  <div onMouseEnter={() => setInputHovered(true)} onMouseLeave={() => setInputHovered(false)}>
                    <InputNumber
                      min={1}
                      size={isTablet ? 'large' : 'middle'}
                      value={record.quantity}
                      className="w-28 md:w-20 lg:w-24  h-min"
                      onFocus={({ target }) => target.select()}
                      onChange={value => dispatch(salesActions.cashRegister.update({ ...record, quantity: Number(value) }))}
                    />
                  </div>
                </div>
              </div>
              <span className=" text-sm text-center font-normal my-auto min-w-28 select-none">
                {functions.money(record.price * record.quantity)}
              </span>
              <div
                className="flex justify-end items-center p-1 pr-3"
                onMouseEnter={() => setInputHovered(true)}
                onMouseLeave={() => setInputHovered(false)}
              >
                <Button shape="circle" type="text" size="large" icon={<CloseOutlined />} onClick={() => onRemove(record)} />
              </div>
            </li>
          );
        })}
      </ul>

      <CashierModal open={open} casherItem={currentProduct} onCancel={closeModal} />
    </div>
  );
};

export default CashRegisterItemsList;
