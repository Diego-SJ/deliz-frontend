import { useAppDispatch, useAppSelector } from '@/hooks/useStore';
import { Product } from '@/redux/reducers/products/types';
import { productHelpers } from '@/utils/products';
import { Button, Drawer, Empty, Input, InputRef } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { salesActions } from '@/redux/reducers/sales';
import { userActions } from '@/redux/reducers/users';
import { CloseOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { productActions } from '@/redux/reducers/products';
import { APP_ROUTES } from '@/routes/routes';
import { useNavigate } from 'react-router-dom';
import { ItemProductMobile } from './product-item-mobile';

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
  const inputSearchRef = useRef<InputRef>(null);
  const { favorite_products = [] } = profile!;
  const navigate = useNavigate();

  useEffect(() => {
    let _products = productHelpers.searchProducts(searchText, products);
    setCurrentProducts(
      _products?.sort((a, b) => {
        if (favorite_products.includes(a.product_id) && !favorite_products.includes(b.product_id)) return -1;
        if (!favorite_products.includes(a.product_id) && favorite_products.includes(b.product_id)) return 1;
        return 0;
      }),
    );
  }, [products, searchText, favorite_products]);

  useEffect(() => {
    if (visible) {
      inputSearchRef.current?.focus();
    }
  }, [visible]);

  const handleClose = () => {
    setSearchText('');
    onClose();
  };

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
      closeIcon={null}
      extra={
        <Button type="text" size="large" onClick={handleClose}>
          <CloseOutlined className="text-xl" />
        </Button>
      }
      styles={{ body: { padding: 0 } }}
      title="Buscar producto"
    >
      <div className="px-5 pt-5">
        <Input.Search
          ref={inputSearchRef}
          allowClear
          size="large"
          autoFocus
          value={searchText}
          className="search-products-input m-0 !border-gray-300"
          placeholder="Buscar producto"
          onFocus={event => {
            event.target?.select();
          }}
          onChange={({ target }) => {
            setSearchText(target.value);
          }}
        />

        <div className=" min-h-[calc(100dvh-175px)] max-h-[calc(100dvh-175px)] overflow-y-scroll py-0">
          {currentProducts.length > 0 ? (
            <div className="flex flex-col">
              {currentProducts.map(product => {
                const price = productHelpers.getProductPrice(product, price_id || null);
                return (
                  <div className="w-full" key={product.product_id}>
                    <ItemProductMobile
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
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="w-full min-h-40 flex flex-col justify-center items-center">
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
