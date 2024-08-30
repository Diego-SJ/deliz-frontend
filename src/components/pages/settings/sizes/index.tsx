import { useAppDispatch, useAppSelector } from '@/hooks/useStore';
import { productActions } from '@/redux/reducers/products';
import { Size } from '@/redux/reducers/products/types';
import { PlusCircleOutlined } from '@ant-design/icons';
import { Button, Drawer, List, Tag, Typography } from 'antd';
import { useEffect, useRef, useState } from 'react';
import useMediaQuery from '@/hooks/useMediaQueries';
import SizeEditor from './editor';
import BreadcrumbSettings from '../../settings/menu/breadcrumb';
import ActionTableButtons from '@/components/molecules/Table/action-table-btns';
import CardRoot from '@/components/atoms/Card';

const ProductSizesPage = () => {
  const dispatch = useAppDispatch();
  const { isTablet } = useMediaQuery();
  const { sizes } = useAppSelector(({ products }) => products);
  const { permissions } = useAppSelector(({ users }) => users.user_auth.profile!);
  const [options, setOptions] = useState<Size[]>([]);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      dispatch(productActions.sizes.get({ refetch: true }));
      return;
    }
  }, [dispatch]);

  useEffect(() => {
    setOptions(sizes?.data || []);
  }, [sizes?.data]);

  const onAddNew = () => {
    dispatch(productActions.setSize({ drawer: 'new' }));
  };

  const onClose = () => {
    dispatch(productActions.setSize({ selected: {} as Size, drawer: null }));
  };

  return (
    <div className="p-4 max-w-[730px] w-full mx-auto">
      <BreadcrumbSettings items={[{ label: 'Tamaños' }]} />

      <div className="flex flex-col mb-0 w-full">
        <Typography.Title level={4}>Tamaños de productos</Typography.Title>

        <div className="flex justify-between md:items-center mb-6 flex-col md:flex-row gap-3">
          <Typography.Text type="secondary">Administra los tamaños de productos que deseas ofrecer</Typography.Text>

          {permissions?.sizes?.add_size?.value && (
            <Button icon={<PlusCircleOutlined />} onClick={onAddNew} size={isTablet ? 'large' : 'middle'}>
              Agregar nuevo
            </Button>
          )}
        </div>
      </div>

      <CardRoot style={{ width: '100%' }} styles={{ body: { padding: 0 } }} title="Tamaños">
        <List
          itemLayout="horizontal"
          footer={
            permissions?.sizes?.add_size?.value ? (
              <div className="px-2">
                <Button type="text" icon={<PlusCircleOutlined />} className="text-primary" onClick={onAddNew}>
                  Agregar nuevo
                </Button>
              </div>
            ) : null
          }
          className="px-0"
          dataSource={options}
          renderItem={item => (
            <List.Item
              styles={{ actions: { paddingRight: 15, margin: 0 } }}
              classNames={{ actions: 'flex' }}
              className="flex"
              actions={[
                <ActionTableButtons
                  hideDeleteButton={!permissions?.sizes?.delete_size?.value}
                  hideEditButton={!permissions?.sizes?.edit_size?.value}
                  deleteFunction={productActions.sizes.delete(item.size_id as number)}
                  editFunction={productActions.sizes.edit(item)}
                />,
              ]}
            >
              <div className="pl-4 md:pl-6 flex gap-4">
                <Typography.Text>{item.name}</Typography.Text>
                <Tag>{item.short_name}</Tag>
              </div>
            </List.Item>
          )}
        />
      </CardRoot>
      <Drawer
        title={sizes?.drawer === 'edit' ? 'Editar tamaño' : 'Agregar nuevo tamaño'}
        width={isTablet ? 350 : 420}
        onClose={onClose}
        open={!!sizes?.drawer}
        styles={{ body: { paddingBottom: 80 } }}
        destroyOnClose
      >
        <SizeEditor onSuccess={onClose} />
      </Drawer>
    </div>
  );
};

export default ProductSizesPage;
