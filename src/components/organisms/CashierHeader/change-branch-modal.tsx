import { useAppDispatch, useAppSelector } from '@/hooks/useStore';
import { branchesActions } from '@/redux/reducers/branches';
import { Branch, CashRegister } from '@/redux/reducers/branches/type';
import { cashiersActions } from '@/redux/reducers/cashiers';
import { ShopOutlined } from '@ant-design/icons';
import { Avatar, Modal, Tag, Typography } from 'antd';

type Props = {
  open: boolean;
  onCancel: () => void;
};

const ChangeBranchModal = ({ open = false, onCancel = () => null }: Props) => {
  const dispatch = useAppDispatch();
  const { branches, currentCashRegister, cash_registers } = useAppSelector(({ branches }) => branches);

  const handleClose = () => {
    onCancel();
  };

  return (
    <Modal
      open={open}
      width={400}
      title={<Typography.Title level={4}>Cambiar Caja Registradora</Typography.Title>}
      onCancel={handleClose}
      footer={null}
    >
      <Typography.Paragraph className="text-sm font-light" style={{ marginBottom: 0 }}>
        Selecciona una caja para comenzar a vender
      </Typography.Paragraph>

      {branches.map(item => (
        <div key={item.branch_id} className="flex flex-col">
          <div className={`flex items-center py-2 gap-3 rounded-lg mt-2 mb-0`}>
            <Avatar shape="square" size="large" icon={<ShopOutlined className="text-blue-600" />} className="bg-blue-600/10" />
            <div className="flex flex-col font-semibold">Sucursal {item.name}</div>
          </div>

          {cash_registers.map(cash_register => {
            if (cash_register.branch_id === item.branch_id) {
              return (
                <div
                  onClick={async () => {
                    await dispatch(branchesActions.setCurrentBranch(item as Branch));
                    await dispatch(branchesActions.setCurrentCashRegister(cash_register as CashRegister));
                    await dispatch(cashiersActions.cash_cuts.fetchCashCutData());
                    handleClose();
                  }}
                  key={cash_register.cash_register_id}
                  className={`flex items-center justify-between px-2 py-2 gap-3 hover:bg-gray-50 cursor-pointer border rounded-lg mt-0 mb-2`}
                >
                  <Typography.Text className="">Caja {cash_register.name}</Typography.Text>
                  {cash_register?.cash_register_id === currentCashRegister?.cash_register_id && <Tag color="green">Actual</Tag>}
                </div>
              );
            }
          })}
        </div>
      ))}
    </Modal>
  );
};

export default ChangeBranchModal;
