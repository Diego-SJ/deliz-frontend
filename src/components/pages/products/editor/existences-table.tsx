import CardRoot from '@/components/atoms/Card';
import { useAppSelector } from '@/hooks/useStore';
import { Inventory } from '@/redux/reducers/products/types';
import { ShopOutlined } from '@ant-design/icons';
import { Avatar, InputNumber, Typography } from 'antd';

type Props = {
  onChange?: (inventory: Inventory) => void;
  setInventory: React.Dispatch<React.SetStateAction<Inventory>>;
  inventory: Inventory;
};

const ExistencesTable = ({ onChange, setInventory, inventory }: Props) => {
  const { branches } = useAppSelector(state => state.branches);

  const handleChange = (value: number, branch_id: string) => {
    setInventory(prev => {
      let newData = { ...prev, [branch_id]: { branch_id, stock: value } };
      if (onChange) onChange(newData);
      return newData;
    });
  };

  return (
    <CardRoot title="Existencias">
      <Typography.Text type="secondary">Administra las existencias de tu producto</Typography.Text>

      <div className="w-full">
        <div className="flex w-full items-center border-b border-slate-200 my-3 pb-2">
          <Typography.Title level={5} className="w-[70%] py-1" style={{ margin: 0, fontSize: 14 }}>
            Sucursal
          </Typography.Title>
          <Typography.Title level={5} className="w-[30%] py-1" style={{ margin: 0, fontSize: 14 }}>
            Cantidad
          </Typography.Title>
        </div>
        <div className="flex w-full flex-col">
          {branches.map((branch, index) => (
            <div key={index} className="w-full flex items-center my-2">
              <div className="w-[70%] py-1 flex gap-3 items-center">
                <Avatar size={40} icon={<ShopOutlined className="text-gray-600" />} className="bg-gray-600/10" />
                <Typography.Text style={{ margin: 0 }}>{branch.name}</Typography.Text>
              </div>
              <div className="w-[30%]">
                <InputNumber
                  value={inventory[branch.branch_id]?.stock || 0}
                  className="max-w-32 w-full"
                  min={0}
                  type="number"
                  inputMode="numeric"
                  size="large"
                  onFocus={({ target }) => (target as HTMLInputElement).select()}
                  onChange={value => handleChange(value as number, branch.branch_id)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </CardRoot>
  );
};

export default ExistencesTable;
