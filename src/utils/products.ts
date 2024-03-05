import { Product } from '@/redux/reducers/products/types';

export const productHelpers = {
  normalizeText: (text?: string): string => {
    return (
      text
        ?.normalize('NFD')
        ?.replace(/[\u0300-\u036f]/g, '')
        ?.toLowerCase() || ''
    );
  },
  searchProducts: function (searchText: string, products: Product[], categoryId: string | number): Product[] {
    const normalizedSearchText = this.normalizeText(searchText);

    const regex = new RegExp(normalizedSearchText, 'i');

    return products.filter(product => {
      return regex?.test(this.normalizeText(product?.name)) || regex?.test(this.normalizeText(product?.description));
    });
  },
};
