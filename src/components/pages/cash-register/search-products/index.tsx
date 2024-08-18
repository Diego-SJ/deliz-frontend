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
import { Drawer } from 'vaul';

const SearchProducts = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { products } = useAppSelector(({ products }) => products);
  const { profile } = useAppSelector(({ users }) => users.user_auth);
  const { price_id } = useAppSelector(({ sales }) => sales.cash_register);
  const [searchText, setSearchText] = useState<string>('');
  const [currentProducts, setCurrentProducts] = useState<Product[]>([]);
  const [inputIsFocused, setInputIsFocused] = useState(false);
  const [selectedCardIndex, setSelectedCardIndex] = useState(-1);
  const searchInputRef = useRef<InputRef>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const { isPhablet, isTablet } = useMediaQuery();
  const [openBarCode, setOpenBarCode] = useState(false);
  const { message } = App.useApp();
  const listReft = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let _products = productHelpers.searchProducts(searchText, products);
    setCurrentProducts(_products?.slice(0, 16) || []);
  }, [products, searchText]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (currentProducts.length) {
        let addPosition = !isPhablet ? 2 : 1;
        let inputIsFocused = document.activeElement === searchInputRef.current?.input;

        if (event.key === 'ArrowDown') {
          if (selectedCardIndex === -1) {
            setSelectedCardIndex(0);
            cardRefs.current[0]?.focus();
          } else if (selectedCardIndex < currentProducts.length - 1) {
            if (!isPhablet && selectedCardIndex + 2 >= currentProducts.length - 1) {
              setSelectedCardIndex(currentProducts.length - 1);
            } else {
              setSelectedCardIndex(prevIndex => prevIndex + addPosition);
            }
            cardRefs.current[selectedCardIndex + addPosition]?.focus();
          } else {
            setSelectedCardIndex(-1);
            searchInputRef.current?.focus();
          }
        } else if (event.key === 'ArrowUp' && selectedCardIndex > 0 && !inputIsFocused) {
          setSelectedCardIndex(prevIndex => prevIndex - addPosition);
          cardRefs.current[selectedCardIndex - addPosition]?.focus();
        } else if (event.key === 'ArrowUp' && selectedCardIndex === 0) {
          setSelectedCardIndex(-1);
          searchInputRef.current?.focus();
        } else if (event.key === 'ArrowLeft' && !inputIsFocused) {
          setSelectedCardIndex(prevIndex => prevIndex - 1);
          cardRefs.current[selectedCardIndex - 1]?.focus();
        } else if (event.key === 'ArrowRight' && !inputIsFocused) {
          setSelectedCardIndex(prevIndex => prevIndex + 1);
          cardRefs.current[selectedCardIndex + 1]?.focus();
        } else if ((event.ctrlKey || event.metaKey) && event.key === 'f') {
          event.preventDefault();
          searchInputRef.current?.focus();
        }
      }
    };

    if (!currentProducts.length) {
      cardRefs.current = [];
    }

    const handleClick = () => {
      setSelectedCardIndex(-1);
      cardRefs.current = [];
    };

    window.addEventListener('keydown', handleKeyDown as unknown as EventListener);
    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('keydown', handleKeyDown as unknown as EventListener);
      window.removeEventListener('click', handleClick);
    };
  }, [selectedCardIndex, currentProducts, isPhablet]);

  const handleItemInteract = (item: Product) => {
    dispatch(salesActions.cashRegister.add({ product: item }));
    if (isTablet) {
      setSearchText('');
    }
    listReft.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  };

  const handleFavorite = (product_id: number) => {
    dispatch(userActions.toggleFavoriteProduct(product_id));
  };

  const onAddNew = () => {
    dispatch(productActions.setCurrentProduct({} as Product));
    navigate(APP_ROUTES.PRIVATE.DASHBOARD.PRODUCT_EDITOR.hash`${'add'}`);
  };

  const onSuccessScan = (barcode: string) => {
    let productFound = products?.find(product => product.code === barcode);

    if (!productFound?.product_id) {
      message.error('Producto no encontrado', 5);
      return null;
    }

    message.success('1 producto agregado', 2);
    handleItemInteract(productFound);
  };

  const handleInputTextChange = useDebouncedCallback(value => {
    setSearchText(value);
  }, 250);

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
            onScan={value => {
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
              onFocus={() => {
                setInputIsFocused(!isTablet);
                setCurrentProducts(products?.slice(0, 16) || []);
                searchInputRef.current?.select();
              }}
              onBlur={() => setInputIsFocused(false)}
              onChange={({ target }) => {
                handleInputTextChange(target.value);
              }}
            />
            {!!searchText && (
              <Button
                size="large"
                icon={<CloseOutlined />}
                onClick={() => {
                  setSearchText('');
                }}
              />
            )}
            <Button size="large" icon={<BarcodeOutlined />} onClick={openBarCodeClick} />
          </Space.Compact>
        ) : (
          <SearchProductsMobile onOpenBarCode={openBarCodeClick} />
        )}
      </div>

      <div className="min-h-[calc(100dvh-169px)] max-h-[calc(100dvh-169px)] overflow-x-auto pt-0 pb-0 md:pt-4 md:pb-4">
        {!!searchText || inputIsFocused ? (
          <div className="px-3 pt-2 md:pt-0">
            {currentProducts.length > 0 ? (
              <Row ref={listReft} gutter={[20, 20]}>
                {currentProducts.map((product, index) => {
                  const price = productHelpers.getProductPrice(product, price_id || null);
                  return (
                    <Col key={product.product_id} lg={12} md={24} xs={24}>
                      <div
                        ref={el => (cardRefs.current[index] = el)}
                        tabIndex={0}
                        className={`outline outline-2 rounded-lg box-border overflow-hidden ${
                          selectedCardIndex === index ? 'outline-primary' : 'outline-transparent'
                        }`}
                        onFocus={() => setSelectedCardIndex(index)}
                        onKeyDown={event => {
                          if (event.key === 'Enter') {
                            setInputIsFocused(false);
                            handleItemInteract(product);
                          }
                        }}
                      >
                        <ItemProduct
                          key={product.product_id}
                          imageSrc={product.image_url}
                          title={product.name}
                          price={price}
                          category={(product as any)?.categories?.name}
                          size={(product as any)?.sizes?.name}
                          onClick={() => {
                            handleItemInteract(product);
                            setInputIsFocused(false);
                          }}
                          isFavorite={profile?.favorite_products?.includes(product.product_id)}
                          onFavorite={() => handleFavorite(product.product_id)}
                        />
                      </div>
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

        <Drawer.Root fixed modal disablePreventScroll>
          <Drawer.Trigger>
            <Button>abrir</Button>
          </Drawer.Trigger>
          <Drawer.Portal>
            <Drawer.Title>Buscar producto</Drawer.Title>
            <Drawer.Description>Buscar producto</Drawer.Description>

            <Drawer.Content className="bg-white z-[20]">
              <Drawer.Handle />
              wefwefe
            </Drawer.Content>
            <Drawer.Overlay />
          </Drawer.Portal>
        </Drawer.Root>
      </div>
    </>
  );
};

export default SearchProducts;
