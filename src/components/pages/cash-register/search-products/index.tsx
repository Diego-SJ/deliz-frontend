import { useAppDispatch, useAppSelector } from '@/hooks/useStore';
import { Product } from '@/redux/reducers/products/types';
import { productHelpers } from '@/utils/products';
import { Button, Col, Empty, Input, InputRef, Row } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { ItemProduct } from './product-item';
import { PlusCircleOutlined } from '@ant-design/icons';
import useMediaQuery from '@/hooks/useMediaQueries';
import { userActions } from '@/redux/reducers/users';
import FavoriteProducts from './favorite-products';
import { productActions } from '@/redux/reducers/products';
import { useNavigate } from 'react-router-dom';
import { APP_ROUTES } from '@/routes/routes';
import { salesActions } from '@/redux/reducers/sales';
import CashRegisterItemsList from '../cart-items-list';
import CashierActions from '../cashier-actions';

const SearchProducts = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { products } = useAppSelector(({ products }) => products);
  const { profile } = useAppSelector(({ users }) => users.user_auth);
  const { price_id } = useAppSelector(({ sales }) => sales.cash_register);
  const [searchText, setSearchText] = useState<string>('');
  const [currentProducts, setCurrentProducts] = useState<Product[]>([]);
  const [selectedCardIndex, setSelectedCardIndex] = useState(-1);
  const searchInputRef = useRef<InputRef>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const { isPhablet, isTablet } = useMediaQuery();
  const listReft = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let _products = productHelpers.searchProducts(searchText, products);
    setCurrentProducts(_products);
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

  return (
    <>
      <div className="px-3">
        <Input.Search
          ref={searchInputRef}
          allowClear
          size="large"
          className="search-products-input m-0 !border-neutral-200"
          placeholder="Buscar producto"
          onFocus={() => searchInputRef.current?.select()}
          onChange={({ target }) => setSearchText(target.value)}
        />
      </div>

      <div className="min-h-[calc(100dvh-169px)] max-h-[calc(100dvh-169px)] overflow-x-auto pt-0 pb-0 md:pt-4 md:pb-4">
        {!!searchText ? (
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
                          onClick={() => handleItemInteract(product)}
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
      </div>
    </>
  );
};

export default SearchProducts;
