import CardRoot from '@/components/atoms/Card';
import { useAppSelector } from '@/hooks/useStore';
import { Inventory } from '@/redux/reducers/products/types';
import { ShopOutlined } from '@ant-design/icons';
import { Avatar, InputNumber, Typography } from 'antd';

type Props = {
  onChange?: (inventory: Inventory) => void;
  setInventory: React.Dispatch<React.SetStateAction<Inventory>>;
  setAlertStock: React.Dispatch<React.SetStateAction<number>>;
  inventory: Inventory;
  alertStock?: number;
};

const ExistencesTable = ({ onChange, setInventory, inventory, alertStock, setAlertStock }: Props) => {
  const { branches } = useAppSelector((state) => state.branches);

  const handleChange = (value: number, branch_id: string) => {
    setInventory((prev) => {
      let newData = { ...prev, [branch_id]: { branch_id, stock: value } };
      if (onChange) onChange(newData);
      return newData;
    });
  };

  return (
    <CardRoot title="Existencias">
      <Typography.Title level={5} className="w-full sm:w-[70%] !mb-2" style={{ margin: 0, fontSize: 14 }}>
        Notificar cuando las existencias sean menores a:
      </Typography.Title>
      <InputNumber
        value={alertStock || 0}
        className="w-full max-w-40"
        min={0}
        type="number"
        inputMode="numeric"
        size="large"
        onFocus={({ target }) => (target as HTMLInputElement).select()}
        onChange={(value) => setAlertStock(value || 0)}
      />

      <div className="w-full mt-5">
        <div className="flex w-full items-center border-b border-slate-200 mt-3 mb-1 sm:mb-3 pb-2">
          <Typography.Title level={5} className="w-full sm:w-[70%] py-1" style={{ margin: 0, fontSize: 14 }}>
            Sucursal
          </Typography.Title>
          <Typography.Title level={5} className="w-[30%] py-1" style={{ margin: 0, fontSize: 14 }}>
            Existencias
          </Typography.Title>
        </div>
        <div className="flex w-full flex-col">
          {branches.map((branch, index) => (
            <div key={index} className="w-full flex gap-1 items-center my-2">
              <div className="flex w-[70%] gap-3 items-center">
                <Avatar size={40} icon={<ShopOutlined className="text-gray-600" />} className="bg-gray-600/10" />
                <Typography.Text style={{ margin: 0 }}>{branch.name}</Typography.Text>
              </div>
              <div className="w-[30%]">
                {/* <div className="flex flex-col"> */}
                {/* <Typography.Text className="!text-xs mb-1">Existencias</Typography.Text> */}
                <InputNumber
                  value={inventory[branch.branch_id]?.stock || 0}
                  className="w-full sm:max-w-32"
                  min={0}
                  type="number"
                  inputMode="numeric"
                  size="large"
                  onFocus={({ target }) => (target as HTMLInputElement).select()}
                  onChange={(value) => handleChange(value as number, branch.branch_id)}
                />
                {/* </div> */}
              </div>
            </div>
          ))}
        </div>
      </div>
    </CardRoot>
  );
};

export default ExistencesTable;
