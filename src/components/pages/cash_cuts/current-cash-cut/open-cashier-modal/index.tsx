import { useAppSelector } from '@/hooks/useStore';
import { Button, Empty } from 'antd';
import { useState } from 'react';
import OpenCashierModal from './modal';

const OpenCashier = () => {
  const { permissions } = useAppSelector(({ users }) => users?.user_auth?.profile!);
  const [visible, setVisible] = useState(false);

  const handleClose = () => {
    setVisible(false);
  };

  return (
    <div className="min-h-60 flex justify-center items-center">
      <Empty description="Aún no tienes una caja abierta">
        {permissions?.cash_registers?.open_cash_cut?.value && <Button onClick={() => setVisible(true)}>Empezar a vender</Button>}
      </Empty>
      <OpenCashierModal visible={visible} onClose={handleClose} />
    </div>
  );
};

export default OpenCashier;
