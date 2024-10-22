import CardRoot from '@/components/atoms/Card';
import { CurrentSale } from '@/redux/reducers/sales/types';
import { Button, Divider, Typography } from 'antd';
import ChangeCustomerModal from './change-customer';
import functions from '@/utils/functions';
import { PAYMENT_METHOD_SHORT_NAME } from '@/constants/payment_methods';
import { ModuleAccess } from '@/routes/module-access';
import { EditOutlined } from '@ant-design/icons';
import { UserPermissions } from '@/redux/reducers/users/types';

type SaleDetailsProps = {
  loading: boolean;
  current_sale: CurrentSale;
  user_permissions?: UserPermissions | null;
  onBranchClick: () => void;
};

const SaleDetails = ({ loading, current_sale, user_permissions: permissions, onBranchClick }: SaleDetailsProps) => {
  const { metadata } = current_sale;

  return (
    <CardRoot loading={loading} style={{ marginTop: 20 }}>
      <div className="w-full ">
        <Typography.Title level={5} className="!font-medium !text-sm !mb-0">
          Cliente
        </Typography.Title>
        <div className="flex items-center justify-between">
          <Typography.Paragraph className="w-full !m-0" type="secondary">
            {current_sale?.metadata?.customers?.name || 'Público general'}
          </Typography.Paragraph>

          {permissions?.sales?.edit_sale?.value && <ChangeCustomerModal />}
        </div>
      </div>
      <Divider className="!my-3" />
      <div className="w-full ">
        <Typography.Title level={5} className="!font-medium !text-sm !mb-0">
          Fecha
        </Typography.Title>
        <div className="flex items-center justify-between">
          <Typography.Paragraph className="w-full !m-0" type="secondary">
            {functions.formatToLocalTimezone(metadata?.created_at?.toString() || '')}
          </Typography.Paragraph>
        </div>
      </div>
      <Divider className="!my-3" />
      <div className="w-full ">
        <Typography.Title level={5} className="!font-medium !text-sm !mb-0">
          Método de pago
        </Typography.Title>
        <div className="flex items-center justify-between">
          <Typography.Paragraph className="w-full !m-0" type="secondary">
            {PAYMENT_METHOD_SHORT_NAME[metadata?.payment_method || ''] || '- - -'}
          </Typography.Paragraph>
        </div>
      </div>
      <Divider className="!my-3" />
      <div className="w-full ">
        <Typography.Title level={5} className="!font-medium !text-sm !mb-0">
          Caja
        </Typography.Title>
        <div className="flex items-center justify-between">
          <Typography.Paragraph className="w-full !m-0" type="secondary">
            Caja {(metadata as any)?.cash_registers?.name || '- - -'}
          </Typography.Paragraph>
        </div>
      </div>
      <Divider className="!my-3" />
      <div className="w-full ">
        <Typography.Title level={5} className="!font-medium !text-sm !mb-0">
          Sucursal
        </Typography.Title>
        <div className="flex items-center justify-between">
          <Typography.Paragraph className="w-full !m-0" type="secondary">
            Sucursal {(metadata as any)?.branches?.name || '- - -'}
          </Typography.Paragraph>
          <ModuleAccess moduleName="transfer_sale">
            <Button
              shape="circle"
              size="large"
              className="!w-fit -mt-5"
              type="text"
              icon={<EditOutlined />}
              block
              onClick={onBranchClick}
            />
          </ModuleAccess>
        </div>
      </div>
      <Divider className="!my-3" />
      <div className="w-full ">
        <Typography.Title level={5} className="!font-medium !text-sm !mb-0">
          Vendedor
        </Typography.Title>
        <div className="flex items-center justify-between">
          <Typography.Paragraph className="w-full !m-0" type="secondary">
            {`${metadata?.profiles?.first_name || ''} ${metadata?.profiles?.last_name || ''}`}
          </Typography.Paragraph>
        </div>
      </div>
    </CardRoot>
  );
};

export default SaleDetails;
