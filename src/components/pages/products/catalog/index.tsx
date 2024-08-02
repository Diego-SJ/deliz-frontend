import BottomMenu from '@/components/organisms/BottomMenu';
import HeaderHome from '@/components/organisms/HeaderHome';
import { CategoryContainer, CategoryContent, FloattingMessage, ProductCard, ProductsContainer } from './styles';
import { CATEGORIES } from '@/constants/categories';
import { Avatar, Button, Col, Input, Row, Typography, message } from 'antd';
import { useAppSelector } from '@/hooks/useStore';
import FallbackImage from '@/assets/img/webp/ice-cream.webp';
import AnimatedBackground from '@/components/atoms/AnimatedBackground';
import { useEffect, useState } from 'react';
import { ShoppingCartOutlined } from '@ant-design/icons';
import functions from '@/utils/functions';
import { useTheme } from 'styled-components';
import { Product } from '@/redux/reducers/products/types';

const ProductsCatalog = () => {
  const theme = useTheme();
  const { products } = useAppSelector(({ products }) => products);
  const [searchText, setSearchText] = useState('');
  const [currentProductos, setCurrentProductos] = useState<Product[]>([]);
  const [categoriesSelected, setCategoriesSelected] = useState<number[]>([]);

  useEffect(() => {
    let _products = [...products];

    if (!!searchText || categoriesSelected.length) {
      _products = products.filter(p => {
        return (
          (functions.includes(p.name, searchText) || functions.includes(p.description, searchText)) &&
          (!!categoriesSelected?.length ? categoriesSelected.includes(p.category_id) : true)
        );
      });
    } else {
      _products = products;
    }

    setCurrentProductos(_products);
  }, [products, categoriesSelected, searchText]);

  const onCategoryClick = (categoryId: number) => {
    let _categories = [...categoriesSelected];
    if (_categories.includes(categoryId)) _categories = categoriesSelected.filter(c => c !== categoryId);
    else _categories.push(categoryId);
    setCategoriesSelected(_categories);
  };

  const addProductToCart = (product: Product) => {
    message.success(`${product.name} fue agregado a tu carrito`);
  };

  return (
    <div style={{ minHeight: '100vh' }}>
      <AnimatedBackground style="light" />
      <HeaderHome />
      <Row style={{ padding: '10px 20px 0' }}>
        <Input
          style={{ borderRadius: 20, maxWidth: 950, margin: '0 auto 0' }}
          size="large"
          placeholder="Buscar producto..."
          onChange={({ target }) => setSearchText(target.value)}
        ></Input>
      </Row>
      <CategoryContainer>
        {CATEGORIES.filter(i => i.public).map(cat => {
          const product = products.find(p => p.category_id === cat.id && !!p.image_url);

          return (
            <CategoryContent
              key={cat.id}
              className={`${categoriesSelected.includes(cat.id) ? 'active' : ''}`}
              onClick={() => onCategoryClick(cat.id)}
            >
              <Avatar src={product?.image_url || FallbackImage} />
              <Typography.Text>{cat.name}</Typography.Text>
            </CategoryContent>
          );
        })}
      </CategoryContainer>
      <ProductsContainer>
        <Row gutter={[30, 30]}>
          {currentProductos.map(p => {
            const category = CATEGORIES.find(c => c.id === p.category_id);
            return (
              <Col xs={{ span: 12 }} lg={{ span: 6 }} md={{ span: 6 }} sm={{ span: 8 }}>
                <ProductCard hoverable>
                  <Avatar size={130} src={p.image_url || FallbackImage} />
                  <div className="product-card-details">
                    <Typography.Title className="title" level={5} color={theme.colors.secondary} style={{ marginBottom: 0 }}>
                      {p.name}
                    </Typography.Title>
                    <Typography.Text className="description" style={{ fontWeight: 100, fontSize: 11 }}>
                      {category?.name}
                    </Typography.Text>
                    <br />
                    <Typography.Text className="description" style={{ color: theme.colors.primary, fontWeight: 600 }}>
                      {functions.money(p.retail_price)}
                    </Typography.Text>
                  </div>
                  <Button
                    className="cart"
                    size="large"
                    shape="circle"
                    type="primary"
                    icon={<ShoppingCartOutlined />}
                    onClick={() => addProductToCart(p)}
                  ></Button>
                </ProductCard>
              </Col>
            );
          })}
        </Row>
      </ProductsContainer>
      <FloattingMessage>Agrega 50 productos más para obtener precio de mayoreo</FloattingMessage>
      <BottomMenu />
    </div>
  );
};

export default ProductsCatalog;
