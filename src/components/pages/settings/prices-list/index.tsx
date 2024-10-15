import { PlusCircleOutlined } from '@ant-design/icons';
import { App, Button, List, Tag, Typography } from 'antd';
import BreadcrumbSettings from '../menu/breadcrumb';
import { useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/useStore';
import { branchesActions } from '@/redux/reducers/branches';
import useMediaQuery from '@/hooks/useMediaQueries';
import CardRoot from '@/components/atoms/Card';
import AddNewPriceModal from './add-new-modal';
import { Price } from '@/redux/reducers/branches/type';

const PricesListPage = () => {
  const mounted = useRef(false);
  const dispatch = useAppDispatch();
  const { prices_list } = useAppSelector((state) => state.branches);
  const { permissions } = useAppSelector(({ users }) => users.user_auth.profile!);
  const { modal } = App.useApp();
  const [open, setOpen] = useState(false);
  const [priceToEdit, setPriceToEdit] = useState<Price | null>(null);
  const { isTablet } = useMediaQuery();

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      dispatch(branchesActions.getPrices());
    }
  }, [mounted]);

  const openModal = () => {
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
    setPriceToEdit(null);
  };

  const onEdit = (data: { price_id: string; name: string }) => {
    setPriceToEdit(data as Price);
    openModal();
  };

  const onDelete = async (price_id: string) => {
    modal.confirm({
      title: '¿Estás seguro de eliminar este precio?',
      content: 'Una vez eliminado, no podrás recuperarlo',
      okText: 'Eliminar',
      cancelText: 'Cancelar',
      okType: 'danger',
      onOk: async () => {
        await dispatch(branchesActions.deletePrice(price_id));
      },
    });
  };

  return (
    <div className="p-4 max-w-[730px] w-full mx-auto">
      <BreadcrumbSettings items={[{ label: 'Lista de precios' }]} />

      <div className="flex flex-col mb-2 w-full">
        <Typography.Title level={4}>Lista de precios</Typography.Title>

        <div className="flex justify-between md:items-center mb-6 flex-col md:flex-row gap-3">
          <Typography.Text className="text-gray-500">
            Configura las listas de precios que deseas ofrecerle a tus clientes
          </Typography.Text>

          {permissions?.price_list?.add_price?.value && (
            <Button icon={<PlusCircleOutlined />} onClick={openModal} size={isTablet ? 'large' : 'middle'}>
              Agregar nuevo
            </Button>
          )}
        </div>
      </div>

      <CardRoot style={{ width: '100%' }} styles={{ body: { padding: 0 } }} title="Precios">
        <List
          itemLayout="horizontal"
          footer={
            permissions?.price_list?.add_price?.value ? (
              <div className="px-2">
                <Button type="text" icon={<PlusCircleOutlined />} className="text-primary" onClick={openModal}>
                  Agregar nuevo
                </Button>
              </div>
            ) : null
          }
          className="px-0"
          dataSource={prices_list}
          renderItem={(item) => (
            <List.Item
              styles={{ actions: { paddingRight: 15, margin: 0 } }}
              classNames={{ actions: 'flex' }}
              className="flex"
              actions={[
                permissions?.price_list?.edit_price?.value ? (
                  <Button type="link" onClick={() => onEdit(item)} className="w-min px-0">
                    Editar
                  </Button>
                ) : null,
                item.is_default || !permissions?.price_list?.delete_price?.value ? null : (
                  <Button danger type="link" className="w-min px-0" onClick={() => onDelete(item.price_id)}>
                    Eliminar
                  </Button>
                ),
              ].filter(Boolean)}
            >
              <div className="pl-4 md:pl-6 flex gap-2">
                <Typography.Text>{item.name}</Typography.Text>
                {item.is_default && (
                  <Tag bordered={false} color="green">
                    Predeterminado
                  </Tag>
                )}
              </div>
            </List.Item>
          )}
        />
      </CardRoot>

      <AddNewPriceModal value={priceToEdit} open={open} onClose={closeModal} />
    </div>
  );
};

export default PricesListPage;
