import { useAppDispatch, useAppSelector } from '@/hooks/useStore';
import { Product } from '@/redux/reducers/products/types';
import { productHelpers } from '@/utils/products';
import { Button, Empty, Input, Drawer, Space } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { salesActions } from '@/redux/reducers/sales';
import { userActions } from '@/redux/reducers/users';
import { BarcodeOutlined, CloseOutlined, PlusCircleOutlined, SearchOutlined } from '@ant-design/icons';
import { productActions } from '@/redux/reducers/products';
import { APP_ROUTES } from '@/routes/routes';
import { useNavigate } from 'react-router-dom';
import { ItemProductMobile } from './product-item-mobile';

type Props = {
  onOpenBarCode: () => void;
};

const SearchProductsMobile = ({ onOpenBarCode }: Props) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [searchText, setSearchText] = useState<string>('');
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [currentProducts, setCurrentProducts] = useState<Product[]>([]);
  const { products } = useAppSelector(({ products }) => products);
  const { profile } = useAppSelector(({ users }) => users.user_auth);
  const { price_id } = useAppSelector(({ sales }) => sales.cash_register);
  const { favorite_products = [] } = profile!;
  const inputSearchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let _products = productHelpers.searchProducts(searchText, products);
    setCurrentProducts(
      _products?.sort((a, b) => {
        if (favorite_products?.includes(a.product_id) && !favorite_products?.includes(b?.product_id)) return -1;
        if (!favorite_products?.includes(a.product_id) && favorite_products?.includes(b?.product_id)) return 1;
        return 0;
      }),
    );
  }, [products, searchText, favorite_products]);

  const handleClose = () => {
    setDrawerVisible(false);
    setSearchText('');
  };

  const handleItemInteract = (item: Product) => {
    handleClose();
    dispatch(salesActions.cashRegister.add({ product: item }));
  };

  const handleFavorite = (product_id: number) => {
    dispatch(userActions.toggleFavoriteProduct(product_id));
  };

  const onAddNew = () => {
    dispatch(productActions.setCurrentProduct({} as Product));
    navigate(APP_ROUTES.PRIVATE.PRODUCT_EDITOR.hash`${'add'}`);
  };

  const openDrawer = () => {
    setDrawerVisible(true);
    setTimeout(() => {
      inputSearchRef.current?.focus();
    }, 100);
  };

  return (
    <>
      <Space.Compact className="!w-full">
        <Button
          size="large"
          className="w-full !text-start flex justify-start text-slate-300"
          icon={<SearchOutlined className="text-slate-400" />}
          onClick={openDrawer}
        >
          Buscar producto
        </Button>
        <Button size="large" icon={<BarcodeOutlined />} onClick={onOpenBarCode} />
      </Space.Compact>

      <Drawer
        open={drawerVisible}
        onClose={handleClose}
        placement="bottom"
        height={'95dvh'}
        className="!duration-0"
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
          <Space.Compact className="!w-full">
            <Input
              ref={inputSearchRef as any}
              size="large"
              prefix={<SearchOutlined className="text-slate-400" />}
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
            {!!searchText && (
              <Button
                size="large"
                icon={<CloseOutlined />}
                onClick={() => {
                  setSearchText('');
                  inputSearchRef.current?.focus();
                }}
              />
            )}
            <Button
              size="large"
              icon={<BarcodeOutlined />}
              onClick={() => {
                handleClose();
                onOpenBarCode();
              }}
            />
          </Space.Compact>
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
    </>
  );
};

export default SearchProductsMobile;
