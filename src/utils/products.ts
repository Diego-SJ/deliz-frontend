import { Inventory, Product } from '@/redux/reducers/products/types';

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
    const normalizedSearchText = this.normalizeText(searchText);

    const regex = new RegExp(normalizedSearchText, 'i');

    return products?.filter(product => {
      return (
        regex?.test(this.normalizeText(product?.name)) ||
        regex?.test(this.normalizeText(product?.description)) ||
        regex?.test(this.normalizeText(product?.code)) ||
        regex?.test(this.normalizeText(product?.sku))
      );
    });
  },
  getProductPrice: (product: Product | null, price_id: string | null): number => {
    return (product?.price_list || {})[price_id || '']?.unit_price || product?.raw_price || product?.retail_price || 0;
  },
  getProductStock: (product: Product | null, branch_id: string | null): number => {
    return (product?.inventory || {})[branch_id || '']?.stock || 0;
  },
  calculateProductStock: (inventory: Inventory): { stock: number; hasStock: boolean } => {
    const stock = Object.values(inventory).reduce((acc, item) => acc + item.stock, 0) || 0;
    return { stock, hasStock: stock > 0 };
  },
};
