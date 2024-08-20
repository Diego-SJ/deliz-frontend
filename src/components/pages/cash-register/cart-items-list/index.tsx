import { useCallback, useRef, useState } from 'react';
import { Avatar, Button, InputNumber, Tag, Typography } from 'antd';
import { CashRegisterItem } from '@/redux/reducers/sales/types';
import functions from '@/utils/functions';
import { CloseOutlined, DollarCircleOutlined, FileImageOutlined, SignatureOutlined, WarningOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '@/hooks/useStore';
import CashierModal from '../cashier-modal';
import { salesActions } from '@/redux/reducers/sales';
import { AvatarProps } from '@/components/molecules/Avatar/types';
import useMediaQuery from '@/hooks/useMediaQueries';

const CashRegisterItemsList = () => {
  const dispatch = useAppDispatch();
  const { cash_register } = useAppSelector(({ sales }) => sales);
  const { currentBranch } = useAppSelector(({ branches }) => branches);
  const [open, setOpen] = useState(false);
  const [inputHovered, setInputHovered] = useState(false);
  const { isTablet } = useMediaQuery();
  const [currentProduct, setCurrentProduct] = useState<CashRegisterItem>();
  const inputGhostRef = useRef<HTMLInputElement>(null);

  const closeModal = () => {
    setOpen(false);
  };

  const openModal = useCallback(
    (item: CashRegisterItem) => {
      if (!inputHovered) {
        inputGhostRef.current?.focus();
        setTimeout(() => {
          setCurrentProduct(item);
          setOpen(!!item?.product?.name);
        }, 100);
      }
    },
    [inputHovered],
  );

  const onRemove = (item: CashRegisterItem) => {
    dispatch(salesActions.cashRegister.remove(item.id));
  };

  return (
    <div className="cashier-items min-h-[calc(100dvh-400px)] max-h-[calc(100dvh-400px)] md:min-h-[calc(100dvh-290px)] md:max-h-[calc(100dvh-290px)] overflow-y-scroll">
      <input type="number" inputMode="numeric" ref={inputGhostRef} className="!h-0 !w-0 !m-0 bg-transparent absolute" />
      <ul className="px-3 py-2 md:px-0 md:py-0 flex flex-col">
        {(cash_register?.items || []).map(record => {
          const stock = (record?.product?.inventory || {})[currentBranch?.branch_id || '']?.stock || 0;

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
              key={record.id}
              className="relative flex flex-col my-1 md:my-0 rounded-lg md:rounded-none bg-white max-md:overflow-hidden max-md:border max-md:border-gray-300/90 md:border-b md:border-gray-100 sm:hover:bg-gray-50/80 cursor-pointer"
            >
              <div className="w-full flex">
                <div className="w-full flex py-1 pl-3 gap-4" onClick={() => openModal(record)}>
                  <Avatar
                    {...avatarProps}
                    className="w-11 h-11 min-w-11 bg-slate-300/10 p-1 my-auto select-none sm:grid sm:place-content-center"
                  />

                  <div className="max-sm:flex-col md:flex-col lg:flex-row flex flex-row w-full items-center py-1 xl:gap-8">
                    <div className="flex flex-col w-full">
                      <Typography.Paragraph
                        ellipsis={{ rows: 2, tooltip: record.product?.name }}
                        className="text-start !font-medium !m-0 !mb-0 sm:!mb-1 w-full leading-4 select-none"
                      >
                        {(record?.product?.name || 'Sin nombre')?.toLowerCase()}
                      </Typography.Paragraph>
                      <p className="text-slate-400 font-light select-none leading-4">
                        {record?.price_type === 'PERSONALIZED' || !record?.product?.product_id ? (
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
                      <div onMouseEnter={() => setInputHovered(!isTablet)} onMouseLeave={() => setInputHovered(false)}>
                        <InputNumber
                          min={1}
                          // size={isTablet ? 'large' : 'middle'}
                          value={record.quantity}
                          className="w-24 md:w-20 lg:w-24  h-min"
                          onFocus={({ target }) => target.select()}
                          onChange={value => dispatch(salesActions.cashRegister.update({ ...record, quantity: Number(value) }))}
                        />
                      </div>
                    </div>
                  </div>
                  <span className=" text-sm text-center w-full sm:w-auto font-normal my-auto select-none">
                    {functions.money(record.price * record.quantity)}
                  </span>
                </div>
                <div
                  className="flex justify-end items-center"
                  onMouseEnter={() => setInputHovered(!isTablet)}
                  onMouseLeave={() => setInputHovered(false)}
                >
                  <Button
                    className="h-full !w-14"
                    type="text"
                    size="large"
                    icon={<CloseOutlined />}
                    onClick={() => onRemove(record)}
                  />
                </div>
              </div>
              {Number(record.quantity) > stock && !!record?.product?.product_id && (
                <Typography.Paragraph type="warning" className="!mx-0 !mt-0 !mb-0 bg-yellow-50 pl-3">
                  <WarningOutlined /> La cantidad ingresada supera el stock
                </Typography.Paragraph>
              )}
            </li>
          );
        })}
      </ul>

      <CashierModal open={open} casherItem={currentProduct} onCancel={closeModal} />
    </div>
  );
};

export default CashRegisterItemsList;
