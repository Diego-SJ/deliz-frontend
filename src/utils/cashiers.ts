import { ZONES } from '@/constants/zones';
import { Branch } from '@/redux/reducers/branches/type';
import { Product } from '@/redux/reducers/products/types';

export const cashierHelpers = {
  getWhosalePrice: (product?: Product, zone?: number) => {
    if (!product) return 0;
    let _zone = zone || 1;
    return (product?.wholesale_price || 0) + ZONES[_zone][product?.category_id || 1][product?.size_id || 2];
  },
  isValidPhone: (phone: string) => {
    if (!phone || phone?.length !== 10) return false;
    let phoneClean = phone?.replace(/[\s-]/g, '')?.trim();
    let regex = /^[0-9]{10}$/;
    return regex.test(phoneClean);
  },
  getAddress: (branch: Branch) => {
    return `${branch?.street || 'Domicilio Conocido'} ${branch?.ext_number || 'S/N'}, ${branch?.city || 'México'}, ${
      branch?.zip_code || '000000'
    }`;
  },
};
