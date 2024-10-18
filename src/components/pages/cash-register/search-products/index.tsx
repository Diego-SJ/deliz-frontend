import { useAppDispatch, useAppSelector } from '@/hooks/useStore';
import { Product } from '@/redux/reducers/products/types';
import { productHelpers } from '@/utils/products';
import { App, Button, Col, Empty, Input, InputRef, Row, Space } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { ItemProduct } from './product-item';
import { BarcodeOutlined, CloseOutlined, PlusCircleOutlined, SearchOutlined } from '@ant-design/icons';
import useMediaQuery from '@/hooks/useMediaQueries';
import { userActions } from '@/redux/reducers/users';
import FavoriteProducts from './favorite-products';
import { productActions } from '@/redux/reducers/products';
import { useNavigate } from 'react-router-dom';
import { APP_ROUTES } from '@/routes/routes';
import { salesActions } from '@/redux/reducers/sales';
import CashRegisterItemsList from '../cart-items-list';
import CashierActions from '../cashier-actions';
import { useDebouncedCallback } from 'use-debounce';
import SearchProductsMobile from './search-products-mobile';
import BarcodeScanner from '@/components/organisms/bar-code-reader';
import { ModuleAccess } from '@/routes/module-access';

const SearchProducts = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { products } = useAppSelector(({ products }) => products);
  const { profile } = useAppSelector(({ users }) => users.user_auth);
  const { price_id } = useAppSelector(({ sales }) => sales.cash_register);
  const [searchText, setSearchText] = useState<string>('');
  const [currentProducts, setCurrentProducts] = useState<Product[]>([]);
  const [inputIsFocused, setInputIsFocused] = useState(false);
  const { isTablet } = useMediaQuery();
  const [openBarCode, setOpenBarCode] = useState(false);
  const { message } = App.useApp();
  const listReft = useRef<HTMLDivElement | null>(null);
  const searchInputRef = useRef<InputRef>(null);

  const handleInputTextChange = useDebouncedCallback(() => {
    let _products = productHelpers.searchProducts(searchText, products);
    setCurrentProducts(_products);
  }, 250);

  useEffect(() => {
    handleInputTextChange();
  }, [products, searchText]);

  const handleItemInteract = (item: Product) => {
    dispatch(salesActions.cashRegister.add({ product: item }));
    if (isTablet) {
      setSearchText('');
    }
  };

  const handleFavorite = (product_id: number) => {
    dispatch(userActions.toggleFavoriteProduct(product_id));
  };

  const onAddNew = () => {
    dispatch(productActions.setCurrentProduct({} as Product));
    navigate(APP_ROUTES.PRIVATE.PRODUCT_EDITOR.hash`${'add'}`);
  };

  const onSuccessScan = (barcode: string) => {
    let productFound = products?.find((product) => product.code === barcode);

    if (!productFound?.product_id) {
      message.error('Producto no encontrado', 5);
      return null;
    }

    message.success('1 producto agregado', 2);
    handleItemInteract(productFound);
  };

  const openBarCodeClick = () => {
    setOpenBarCode(true);
  };

  return (
    <>
      <div className="flex gap-4 px-3 w-full">
        {openBarCode && (
          <BarcodeScanner
            paused={!openBarCode}
            onCancel={() => setOpenBarCode(false)}
            onScan={(value) => {
              onSuccessScan(value[0].rawValue);
            }}
          />
        )}
        {!isTablet ? (
          <Space.Compact className="!w-full">
            <Input
              prefix={<SearchOutlined className="text-slate-400" />}
              ref={searchInputRef}
              size="large"
              className="search-products-input m-0 !border-gray-300 !w-full"
              placeholder="Buscar producto"
              value={searchText}
              onFocus={() => {
                setInputIsFocused(!isTablet);
                setCurrentProducts(products);
                searchInputRef.current?.select();
              }}
              onBlur={() => {
                setTimeout(() => {
                  setInputIsFocused(false);
                }, 100);
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
                  setInputIsFocused(false);
                }}
              />
            )}
            <ModuleAccess moduleName="use_barcode_scanner">
              <Button size="large" icon={<BarcodeOutlined />} onClick={openBarCodeClick} />
            </ModuleAccess>
          </Space.Compact>
        ) : (
          <SearchProductsMobile onOpenBarCode={openBarCodeClick} />
        )}
      </div>

      <div className="min-h-[calc(100dvh-169px)] max-h-[calc(100dvh-169px)] overflow-x-auto pt-0 pb-0 md:pt-4 md:pb-4">
        {!!searchText || inputIsFocused ? (
          <div className="px-3 pt-2 md:pt-0">
            {currentProducts?.length ? (
              <Row ref={listReft} gutter={[20, 20]}>
                {currentProducts.map((product) => {
                  const price = productHelpers.getProductPrice(product, price_id || null);
                  return (
                    <Col key={product.product_id} lg={12} md={24} xs={24}>
                      <ItemProduct
                        imageSrc={product.image_url}
                        title={product.name}
                        price={price}
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
                  <Button onClick={onAddNew} icon={<PlusCircleOutlined />}>
                    Registrar producto {searchText}
                  </Button>
                </Empty>
              </div>
            )}
          </div>
        ) : !isTablet ? (
          <div className="px-3">
            <FavoriteProducts onActionClick={() => searchInputRef.current?.focus()} />
          </div>
        ) : (
          <div className="relative">
            <CashRegisterItemsList />
            <div className="bottom-0 w-full border-t border-dashed border-slate-400 md:border-none">
              <CashierActions />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default SearchProducts;
