import { useAppDispatch, useAppSelector } from '@/hooks/useStore';
import { productActions } from '@/redux/reducers/products';
import { Unit } from '@/redux/reducers/products/types';
import { PlusCircleOutlined } from '@ant-design/icons';
import { Button, Card, Drawer, List, Tag, Typography } from 'antd';
import { useEffect, useRef, useState } from 'react';
import useMediaQuery from '@/hooks/useMediaQueries';
import SizeEditor from './editor';
import ActionTableButtons from '@/components/molecules/Table/action-table-btns';
import BreadcrumbSettings from '../../settings/menu/breadcrumb';

const ProductUnitsPage = () => {
  const dispatch = useAppDispatch();
  const { isTablet } = useMediaQuery();
  const { units } = useAppSelector(({ products }) => products);
  const { permissions } = useAppSelector(({ users }) => users.user_auth.profile!);
  const [options, setOptions] = useState<Unit[]>([]);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      dispatch(productActions.units.get({ refetch: true }));
      return;
    }
  }, [dispatch]);

  useEffect(() => {
    setOptions(units?.data || []);
  }, [units?.data]);

  const onAddNew = () => {
    dispatch(productActions.setUnit({ drawer: 'new' }));
  };

  const onClose = () => {
    dispatch(productActions.setUnit({ selected: {} as Unit, drawer: null }));
  };

  return (
    <div className="p-4 max-w-[730px] w-full mx-auto">
      <BreadcrumbSettings items={[{ label: 'Unidades' }]} />

      <div className="flex flex-col mb-0 w-full">
        <Typography.Title level={4}>Unidades de medida</Typography.Title>

        <div className="flex justify-between md:items-center mb-6 flex-col md:flex-row gap-3">
          <Typography.Text type="secondary">Administra las unidades de medida que tendrán tus productos</Typography.Text>

          {permissions?.units?.add_unit && (
            <Button icon={<PlusCircleOutlined />} onClick={onAddNew} size={isTablet ? 'large' : 'middle'}>
              Agregar nuevo
            </Button>
          )}
        </div>
      </div>

      <Card style={{ width: '100%' }} styles={{ body: { padding: 0 } }} title="Unidades" className="shadow-md rounded-xl">
        <List
          itemLayout="horizontal"
          footer={
            permissions?.units?.add_unit ? (
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
                  hideDeleteButton={!permissions?.units?.delete_unit}
                  hideEditButton={!permissions?.units?.edit_unit}
                  deleteFunction={productActions.units.delete(item.unit_id as number)}
                  editFunction={productActions.units.edit(item)}
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
      </Card>
      <Drawer
        title={units?.drawer === 'edit' ? 'Editar unidad' : 'Agregar nueva unidad'}
        width={isTablet ? 350 : 420}
        onClose={onClose}
        open={!!units?.drawer}
        styles={{ body: { paddingBottom: 80 } }}
        destroyOnClose
      >
        <SizeEditor onSuccess={onClose} />
      </Drawer>
    </div>
  );
};

export default ProductUnitsPage;
