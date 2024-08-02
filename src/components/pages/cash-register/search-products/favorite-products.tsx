import { useAppDispatch, useAppSelector } from '@/hooks/useStore';
import { Product } from '@/redux/reducers/products/types';
import { productHelpers } from '@/utils/products';
import { Button, Col, Empty, Row } from 'antd';
import { useEffect, useState } from 'react';
import { ItemProduct } from './product-item';
import { SearchOutlined } from '@ant-design/icons';
import { userActions } from '@/redux/reducers/users';
import { salesActions } from '@/redux/reducers/sales';

type Props = {
  onActionClick: () => void;
};

const FavoriteProducts = ({ onActionClick }: Props) => {
  const dispatch = useAppDispatch();
  const { products } = useAppSelector(({ products }) => products);
  const { price_id } = useAppSelector(({ sales }) => sales.cash_register);
  const { profile } = useAppSelector(({ users }) => users.user_auth);
  const [currentProducts, setCurrentProducts] = useState<Product[]>([]);

  useEffect(() => {
    let _products = products.filter(product => profile?.favorite_products?.includes(product.product_id));
    setCurrentProducts(_products);
  }, [products, profile?.favorite_products]);

  const handleItemInteract = (item: Product) => {
    dispatch(salesActions.cashRegister.add({ product: item }));
  };

  const handleFavorite = (product_id: number) => {
    dispatch(userActions.toggleFavoriteProduct(product_id));
  };

  return (
    <>
      {currentProducts.length > 0 ? (
        <Row gutter={[20, 20]}>
          {currentProducts.map(product => {
            const price = productHelpers.getProductPrice(product, price_id || null);

            return (
              <Col key={product.product_id} lg={12} md={24} xs={24}>
                <ItemProduct
                  key={product.product_id}
                  imageSrc={product.image_url}
                  title={product.name}
                  price={price}
                  focuseable={false}
                  category={(product as any)?.categories?.name}
                  size={(product as any)?.sizes?.name}
                  onClick={() => handleItemInteract(product)}
                  isFavorite={profile?.favorite_products?.includes(product.product_id)}
                  onFavorite={() => handleFavorite(product.product_id)}
                />
              </Col>
            );
          })}
        </Row>
      ) : (
        <div className="w-full min-h-96 flex flex-col justify-center items-center">
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No se encontraron coincidencias">
            <Button onClick={onActionClick} icon={<SearchOutlined />}>
              Busca un producto
            </Button>
          </Empty>
        </div>
      )}
    </>
  );
};

export default FavoriteProducts;
