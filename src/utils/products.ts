import { Inventory, PriceList, Product } from '@/redux/reducers/products/types';
import functions from './functions';

export const productHelpers = {
  normalizeText: (text?: string): string => {
    return (
      text
        ?.normalize('NFD')
        ?.replace(/[\u0300-\u036f]/g, '')
        ?.toLowerCase() || ''
    );
  },
  searchProducts: function (searchText: string, products: Product[]): Product[] {
    return products?.filter((product) => {
      return (
        functions.includes(product?.name, searchText) ||
        functions.includes(product?.description, searchText) ||
        functions.includes(product?.code, searchText) ||
        functions.includes(product?.sku, searchText) ||
        functions.includes(product?.categories?.name, searchText)
      );
    });
  },
  getProductPrice: (product: Product | null, price_id: string | null): number => {
    return (product?.price_list || {})[price_id || '']?.unit_price || product?.raw_price || 0;
  },
  getProductStock: (product: Product | null, branch_id: string | null): number => {
    return (product?.inventory || {})[branch_id || '']?.stock || 0;
  },
  calculateProductStock: (inventory: Inventory): { stock: number; hasStock: boolean } => {
    const stock = Object.values(inventory).reduce((acc, item) => acc + item.stock, 0) || 0;
    return { stock, hasStock: stock > 0 };
  },
  getDefaultPrice: (price_list: PriceList, rawPrice?: number): number => {
    let values = Object.values(price_list || {});
    return values?.find((item) => !!item?.is_default)?.unit_price || values[0]?.unit_price || rawPrice || 0;
  },
};
