import { useAppDispatch } from '@/hooks/useStore';
import { customerActions } from '@/redux/reducers/customers';
import { useMembershipAccess } from '@/routes/module-access';
import { App, Button } from 'antd';
import { Trash2 } from 'lucide-react';

type Props = {
  customer_id: number;
  onCompleted?: () => void;
};

const DeleteCustomer = ({ customer_id, onCompleted }: Props) => {
  const dispatch = useAppDispatch();
  const { hasAccess, isAdmin } = useMembershipAccess();
  const { modal } = App.useApp();

  const handleDelete = () => {
    modal.confirm({
      title: 'Eliminar cliente',
      content: 'Si el cliente tiene ventas asociadas, estas no se eliminarán. ¿Estás seguro de eliminar este cliente?',
      okText: 'Eliminar',
      cancelText: 'Cancelar',
      okType: 'danger',
      onOk: async () => {
        const result = await dispatch(customerActions.deleteCustomerById(customer_id));
        if (result && onCompleted) onCompleted();
      },
    });
  };

  if (!hasAccess('delete_customer') && !isAdmin) return;

  return (
    <Button danger type="primary" icon={<Trash2 className="w-4 h-4" />} onClick={handleDelete}>
      Eliminar
    </Button>
  );
};

export default DeleteCustomer;
