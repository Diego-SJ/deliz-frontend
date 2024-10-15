import CardRoot from '@/components/atoms/Card';
import { useAppSelector } from '@/hooks/useStore';
import { Price } from '@/redux/reducers/branches/type';
import { PriceList } from '@/redux/reducers/products/types';
import functions from '@/utils/functions';
import { PlusCircleOutlined } from '@ant-design/icons';
import { Button, Form, InputNumber, Typography } from 'antd';
import { useState } from 'react';
import AddNewPriceModal from '../../settings/prices-list/add-new-modal';

type Props = {
  onChange?: (priceList: PriceList) => void;
  setPriceList: React.Dispatch<React.SetStateAction<PriceList>>;
  priceList: PriceList;
};

const PricesTable = ({ onChange, priceList, setPriceList }: Props) => {
  const { prices_list } = useAppSelector((state) => state.branches);
  const { profile } = useAppSelector(({ users }) => users?.user_auth);
  const [unitPrice, setUnitPrice] = useState(0);
  const [open, setOpen] = useState(false);

  const handleChange = (value: number, price: Price) => {
    setPriceList((prev) => {
      let newData = {
        ...prev,
        [price.price_id]: { price_id: price.price_id, is_default: !!price.is_default, unit_price: value },
      };
      if (onChange) onChange(newData);
      return newData;
    });
  };

  const handleModal = () => {
    setOpen((prev) => !prev);
  };

  return (
    <>
      <CardRoot
        title="Precios"
        extra={
          profile?.permissions?.price_list?.add_price?.value && (
            <Button icon={<PlusCircleOutlined />} onClick={() => handleModal()}>
              Agregar nuevo precio
            </Button>
          )
        }
      >
        <div className="w-full">
          <div className="w-full md:max-w-[300px] mb-10 flex gap-2 items-start flex-col justify-center">
            <Form.Item
              label="Precio unitario"
              className="w-full mb-0"
              name="raw_price"
              tooltip="Precio que cuesta fabricar o adquirir el producto. Este precio no se mostrará a los clientes."
            >
              <InputNumber
                prefix="$"
                className="w-full"
                placeholder="0.0"
                min={0}
                size="large"
                addonAfter="Por unidad"
                value={unitPrice}
                type="number"
                inputMode="decimal"
                onFocus={({ target }) => (target as HTMLInputElement).select()}
                onChange={(value) => setUnitPrice(value as number)}
              />
            </Form.Item>
          </div>

          <div className="flex w-full items-center border-b border-slate-200 my-3 pb-2">
            <Typography.Title level={5} className="w-full md:w-[50%] py-1" style={{ margin: 0, fontSize: 14 }}>
              Precio(s) de venta <br />{' '}
              <span className="text-xs text-neutral-400 font-extralight">(Impuestos incluidos)</span>
            </Typography.Title>
            <Typography.Title
              level={5}
              className="hidden md:block w-[25%] py-1 text-center "
              style={{ margin: 0, fontSize: 14 }}
            >
              Márgen
            </Typography.Title>
            <Typography.Title
              level={5}
              className="hidden md:block w-[25%] py-1 text-center "
              style={{ margin: 0, fontSize: 14 }}
            >
              Ganancia
            </Typography.Title>
          </div>
          <div className="flex w-full flex-col">
            {prices_list?.map((price, index) => (
              <div key={index} className="w-full flex flex-col md:flex-row items-center mb-6 md:mb-1">
                <div className="w-full py-1 flex gap-2 items-start flex-col justify-center">
                  <Typography.Text className="!m-0 !text-sm">{price?.name || ''}</Typography.Text>
                  <InputNumber
                    value={priceList[price?.price_id || '']?.unit_price || 0}
                    onChange={(value) => handleChange(value as number, price)}
                    onFocus={({ target }) => (target as HTMLInputElement).select()}
                    prefix="$"
                    size="large"
                    className="w-full mb-0"
                    type="number"
                    inputMode="decimal"
                    placeholder="0.0"
                    min={0}
                    addonAfter="Por unidad"
                  />
                </div>
                <div className="w-full flex pt-1 md:pt-6">
                  <Typography.Text className="text-neutral-500 w-full text-start md:text-center">
                    <span className="mr-4 inline-flex md:hidden">Márgen</span>{' '}
                    {unitPrice
                      ? ((((priceList[price.price_id]?.unit_price || 0) - unitPrice) / unitPrice) * 100).toFixed(2)
                      : 0}
                    %
                  </Typography.Text>
                  <Typography.Text className="text-neutral-500 w-full text-start md:text-center">
                    <span className="mr-4 inline-flex md:hidden">Ganancia</span>
                    {functions.money(
                      unitPrice ? ((priceList[price.price_id]?.unit_price || 0) - unitPrice).toFixed(2) : 0,
                    )}
                  </Typography.Text>
                </div>
              </div>
            ))}
            {!prices_list?.length && (
              <div className="flex justify-center flex-col items-center gap-2 my-3">
                <div className="w-full text-center">No hay precios disponibles</div>
                <Button icon={<PlusCircleOutlined />} className="w-fit" onClick={() => handleModal()}>
                  Agregar precio
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardRoot>
      <AddNewPriceModal open={open} onClose={handleModal} />
    </>
  );
};

export default PricesTable;
