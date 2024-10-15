import { PERMISSION_NAMES } from '@/components/pages/settings/users/permissions/data-and-types';
import { PLANS_IDS } from '@/constants/membership-plans';
import { useAppSelector } from '@/hooks/useStore';
import { FC } from 'react';

export type AppModules =
  | keyof typeof PERMISSION_NAMES
  | 'use_barcode_scanner'
  | 'transfer_sale'
  | 'orders_by_whatsapp'
  | 'landing_page'
  | 'basic_permissions'
  | 'chat_ia';

const plans: { [planId: number]: AppModules[] } = {
  // basic
  [PLANS_IDS.BASIC]: [],
  // essential
  [PLANS_IDS.ESSENTIAL]: [
    'use_barcode_scanner',
    'update_image',
    'apply_shipping',
    'add_custom_price',
    'online_store',
    'make_cash_cut',
    'reports',
    'basic_permissions',
    'products',
    'sales',
    'pos',
    'customers',
    'company',
    'cash_registers',
    'show_in_catalog',
  ],
  // advanced
  [PLANS_IDS.ADVANCED]: [
    'view_users',
    'view_branches',
    'use_barcode_scanner',
    'update_image',
    'apply_shipping',
    'add_custom_price',
    'edit_sale',
    'online_store',
    'download_receipt',
    'orders_by_whatsapp',
    'make_cash_cut',
    'expenses',
    'reports',
    'basic_permissions',
    'chat_ia',
    'view_sales_report',
    'view_products_report',
    'view_customers_report',
    'products',
    'sales',
    'pos',
    'customers',
    'company',
    'branches',
    'cash_registers',
    'price_list',
    'categories',
    'sizes',
    'units',
    'show_in_catalog',
  ],
  // pro
  [PLANS_IDS.PRO]: [
    'view_users',
    'view_branches',
    'use_barcode_scanner',
    'update_image',
    'apply_shipping',
    'add_custom_price',
    'transfer_sale',
    'edit_sale',
    'download_receipt',
    'online_store',
    'orders_by_whatsapp',
    'landing_page',
    'make_cash_cut',
    'expenses',
    'reports',
    'basic_permissions',
    'chat_ia',
    'view_sales_report',
    'view_products_report',
    'view_customers_report',
    'products',
    'sales',
    'expenses',
    'pos',
    'customers',
    'company',
    'branches',
    'cash_registers',
    'price_list',
    'categories',
    'sizes',
    'units',
    'upload_evidence',
    'show_in_catalog',
  ],
};

type ModuleAccessProps = {
  moduleName: AppModules;
  children: React.ReactNode;
};

export const ModuleAccess: FC<ModuleAccessProps> = ({ moduleName, children }) => {
  const { company } = useAppSelector(({ app }) => app);

  if (company?.membership_id && plans[company.membership_id].includes(moduleName as AppModules)) {
    return <>{children}</>;
  }
  return null;
};

export const MAX_USERS = {
  [PLANS_IDS.BASIC]: 1,
  [PLANS_IDS.ESSENTIAL]: 2,
  [PLANS_IDS.ADVANCED]: 3,
  [PLANS_IDS.PRO]: 100,
};

export const MAX_BRANCHES = {
  [PLANS_IDS.BASIC]: 1,
  [PLANS_IDS.ESSENTIAL]: 1,
  [PLANS_IDS.ADVANCED]: 2,
  [PLANS_IDS.PRO]: 3,
};

export const MAX_CASH_REGISTERS = {
  [PLANS_IDS.BASIC]: 1,
  [PLANS_IDS.ESSENTIAL]: 1,
  [PLANS_IDS.ADVANCED]: 2,
  [PLANS_IDS.PRO]: 100,
};

export const useMembershipAccess = () => {
  const { company } = useAppSelector(({ app }) => app);
  const { user_auth } = useAppSelector(({ users }) => users);

  const maxUsers = MAX_USERS[company?.membership_id || 1] || 1;
  const maxBranches = MAX_BRANCHES[company?.membership_id || 1] || 1;
  const maxCashRegisters = MAX_CASH_REGISTERS[company?.membership_id || 1] || 1;

  const hasAccess = (moduleName: AppModules): boolean => {
    return !!company?.membership_id && !!plans[company.membership_id].includes(moduleName);
  };

  const hasModuleAccess = (moduleProperties?: { [key: string]: any }): boolean => {
    if (!moduleProperties) return false;
    return Object.values(moduleProperties || { module_name: false })?.some((prop) => prop?.value);
  };

  const validateAccessFeature = (feature: any, moduleName: AppModules) => {
    if (company?.membership_id && plans[company.membership_id].includes(moduleName)) {
      return feature;
    }
    return undefined;
  };

  return {
    hasAccess,
    hasModuleAccess,
    validateAccessFeature,
    maxUsers,
    maxBranches,
    maxCashRegisters,
    maxProducts: company?.membership_id === PLANS_IDS.BASIC ? 1 : 10000,
    isAdmin: user_auth?.isAdmin || false,
  };
};
