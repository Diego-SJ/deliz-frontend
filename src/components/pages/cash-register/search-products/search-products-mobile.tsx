import { useAppDispatch, useAppSelector } from '@/hooks/useStore';
import { Product } from '@/redux/reducers/products/types';
import { productHelpers } from '@/utils/products';
import { Button, Col, Drawer, Empty, Input, Row } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { ItemProduct } from './product-item';
import { salesActions } from '@/redux/reducers/sales';
import { userActions } from '@/redux/reducers/users';
import { PlusCircleOutlined } from '@ant-design/icons';
import { productActions } from '@/redux/reducers/products';
import { APP_ROUTES } from '@/routes/routes';
import { useNavigate } from 'react-router-dom';

type Props = {
  visible: boolean;
  onClose: () => void;
};

const SearchProductsMobile = ({ visible = false, onClose }: Props) => {
  const dispatch = useAppDispatch();
  const [searchText, setSearchText] = useState<string>('');
  const [currentProducts, setCurrentProducts] = useState<Product[]>([]);
  const { products } = useAppSelector(({ products }) => products);
  const { profile } = useAppSelector(({ users }) => users.user_auth);
  const { price_id } = useAppSelector(({ sales }) => sales.cash_register);
  const touchStartY = useRef<number | null>(null);
  const touchEndY = useRef<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleTouchStart = (event: TouchEvent) => {
      touchEndY.current = null; // Reset touch end
      touchStartY.current = event.touches[0].clientY;
    };

    const handleTouchMove = (event: TouchEvent) => {
      touchEndY.current = event.touches[0].clientY;
    };

    const handleTouchEnd = () => {
      if (touchStartY.current !== null && touchEndY.current !== null) {
        const deltaY = touchStartY.current - touchEndY.current;
        // Detect if swipe down (swipe down will have deltaY < 0)
        if (deltaY < -50) {
          onClose();
        }
      }
    };

    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [onClose]);

  useEffect(() => {
    let _products = productHelpers.searchProducts(searchText, products);
    setCurrentProducts(_products?.slice(0, 16) || []);
  }, [products, searchText]);

  const handleClose = () => {
    onClose();
  };

  const handleInputTextChange = useDebouncedCallback(value => {
    setSearchText(value);
  }, 250);

  const handleItemInteract = (item: Product) => {
    dispatch(salesActions.cashRegister.add({ product: item }));
    onClose();
  };

  const handleFavorite = (product_id: number) => {
    dispatch(userActions.toggleFavoriteProduct(product_id));
  };

  const onAddNew = () => {
    dispatch(productActions.setCurrentProduct({} as Product));
    navigate(APP_ROUTES.PRIVATE.DASHBOARD.PRODUCT_EDITOR.hash`${'add'}`);
  };

  return (
    <Drawer
      open={visible}
      onClose={handleClose}
      placement="bottom"
      height={'95dvh'}
      styles={{ body: { padding: 0 } }}
      title="Buscar producto"
    >
      <div className="px-5 pt-5">
        <Input.Search
          allowClear
          size="large"
          autoFocus
          className="search-products-input m-0 !border-gray-300"
          placeholder="Buscar producto"
          onFocus={event => {
            event.target?.select();
          }}
          onChange={({ target }) => {
            handleInputTextChange(target.value);
          }}
        />

        <div className=" min-h-[calc(100dvh-155px)] max-h-[calc(100dvh-155px)] overflow-scroll py-5">
          {currentProducts.length > 0 ? (
            <Row gutter={[20, 20]}>
              {currentProducts.map((product, index) => {
                const price = productHelpers.getProductPrice(product, price_id || null);
                return (
                  <Col key={product.product_id} lg={12} md={24} xs={24}>
                    <ItemProduct
                      key={product.product_id}
                      imageSrc={product.image_url}
                      title={product.name}
                      price={price}
                      category={(product as any)?.categories?.name}
                      size={(product as any)?.sizes?.name}
                      onClick={() => {
                        handleItemInteract(product);
                      }}
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
                <Button onClick={onAddNew} icon={<PlusCircleOutlined />}>
                  Registrar producto {searchText}
                </Button>
              </Empty>
            </div>
          )}
        </div>
      </div>
    </Drawer>
  );
};

export default SearchProductsMobile;
