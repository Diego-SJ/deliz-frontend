import { useAppSelector } from '@/hooks/useStore';
import { Product } from '@/redux/reducers/products/types';
import { APP_ROUTES } from '@/routes/routes';
import { EditOutlined, FileImageOutlined, SignatureOutlined } from '@ant-design/icons';
import { Avatar, Button, Tag, Typography } from 'antd';

type Props = {
  product?: Partial<Product> | null;
  stock?: number;
  isManualEntry?: boolean;
  enableEdit?: boolean;
  icon?: React.ReactNode;
  onButtonClick?: () => void;
};

const ProductAvatar = ({ product, stock = 0, enableEdit = false, icon, onButtonClick, isManualEntry = false }: Props) => {
  const { currentBranch } = useAppSelector(({ branches }) => branches);
  const { permissions } = useAppSelector(({ users }) => users?.user_auth?.profile!);
  const productStock = stock || product?.inventory?.[currentBranch?.branch_id || '']?.stock || 0;

  const handleClick = () => {
    if (onButtonClick) onButtonClick();
    else if (enableEdit) {
      window.open(APP_ROUTES.PRIVATE.PRODUCT_EDITOR.hash`${'edit'}/${product?.product_id}`, '_blank');
    }
  };

  return (
    <div className="w-full flex gap-4 items-center pt-2">
      <Avatar
        src={product?.image_url}
        size={60}
        shape="square"
        icon={
          isManualEntry ? (
            <SignatureOutlined className="text-slate-400 text-3xl" />
          ) : (
            <FileImageOutlined className="text-slate-400 text-3xl" />
          )
        }
        className="bg-slate-100 p-1 !min-w-16 !max-h-16 max-w-16 min-h-16"
      />
      <div className="flex flex-col justify-between w-full">
        <Typography.Title level={5} className="!m-0 !leading-5">
          {product?.name || 'Sin nombre'}
        </Typography.Title>

        <div className={`flex justify-between items-center mb-0 ${enableEdit ? '' : 'mb-1'}`}>
          <Typography.Paragraph className="!m-0 text-slate-400">
            {product?.categories?.name || 'Sin categoría'}
          </Typography.Paragraph>

          {(enableEdit || onButtonClick) && !!permissions?.products?.edit_product && (
            <Button
              icon={icon || <EditOutlined />}
              onClick={() => {
                handleClick();
              }}
            />
          )}
        </div>
        <Tag color={isManualEntry ? 'purple' : `${productStock <= 0 ? 'volcano' : ''}`} className="w-fit">
          {isManualEntry ? 'Producto personalizado' : productStock === 0 ? 'Sin stock' : `${productStock} unidades`}
        </Tag>
      </div>
    </div>
  );
};

export default ProductAvatar;
