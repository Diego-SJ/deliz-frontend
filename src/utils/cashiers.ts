import { Branch } from '@/redux/reducers/branches/type';

export const cashierHelpers = {
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
