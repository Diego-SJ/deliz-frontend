import HeaderHome from '@/components/organisms/HeaderHome';
import { Avatar, Typography } from 'antd';
import { useEffect } from 'react';
import { CardCategory, CardPopularproduct, CategoryContainer, HeaderTitleContainer } from './styles';
import { useAppDispatch, useAppSelector } from '@/hooks/useStore';
import { CATEGORIES } from '@/constants/categories';
import { Product } from '@/redux/reducers/products/types';
import { COLORS } from '@/constants/colors';
import FallbackImage from '@/assets/logo-color.svg';
import AnimatedBackground from '@/components/atoms/AnimatedBackground';
import useMediaQuery from '@/hooks/useMediaQueries';
import BottomMenu from '@/components/organisms/BottomMenu';
import { productActions } from '@/redux/reducers/products';

const getPopularProducts = (products: Product[]) => {
  return products?.slice(0, 10);
};

const Home = () => {
  const dispatch = useAppDispatch();
  const { isTablet } = useMediaQuery();
  const { products } = useAppSelector(({ products }) => products);

  useEffect(() => {
    if (!products.length) dispatch(productActions.fetchProducts({ refetch: true }));
  }, [products, dispatch]);

  return (
    <div style={{ background: '#fff', minHeight: '100vh', maxHeight: '100vh' }}>
      <AnimatedBackground style="light" />
      <HeaderHome hideLogo={!isTablet} />
      <HeaderTitleContainer>
        {!isTablet && <Avatar size={90} src={FallbackImage} style={{ marginBottom: 5 }} className="!p-1" />}
        <Typography.Title level={isTablet ? 3 : 2} style={{ margin: isTablet ? '20px 0 0' : '0 20px 5px' }}>
          ¡Bienvenido a <span>Posiffy</span>!
        </Typography.Title>
      </HeaderTitleContainer>

      <Typography.Title level={3} style={{ padding: '20px 20px 0', margin: 0 }}>
        Categorías
      </Typography.Title>
      <CategoryContainer>
        {CATEGORIES.filter(i => i.public).map(cat => {
          const product = products.find(p => p.category_id === cat.id && !!p.image_url);

          return (
            <CardCategory key={cat.id} style={{ background: cat.gradient.radial }}>
              <img src={product?.image_url || ''} alt={product?.name} className="!w-[18rem] !h-auto aspect-square" />
              <Typography.Text>{cat.name}</Typography.Text>
            </CardCategory>
          );
        })}
      </CategoryContainer>

      <Typography.Title level={3} style={{ padding: '0 20px 0', margin: 0 }}>
        Productos más populares
      </Typography.Title>
      <CategoryContainer>
        {getPopularProducts(products).map((p, index) => {
          return (
            <CardPopularproduct key={p.product_id} style={{ background: Object.values(COLORS)[index].light }}>
              <div
                className="pp-image"
                style={{
                  backgroundColor: Object.values(COLORS)[index].solid,
                  backgroundImage: `url('${p?.image_url}')`,
                  filter: 'drop-shadow(0 5px 10px rgba(0, 0, 0, 0.5))',
                }}
              />
              <span className="pp-name">{p.name}</span>
            </CardPopularproduct>
          );
        })}
      </CategoryContainer>
      {/* <BottomMenu /> */}
    </div>
  );
};

export default Home;
