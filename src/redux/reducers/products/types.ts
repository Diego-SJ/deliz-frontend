import { Pagination } from '@supabase/supabase-js';

export type ProductsSlice = {
  products: Product[];
  filters: {
    products: Partial<ProductFilters> | null;
  };
  categories: Category[];
  current_product: Product;
  current_category: Category;
  sizes?: Sizes;
  units?: Units;
  loading: boolean;
};

export type ProductFilters = {
  categories: number[];
  search: string;
  size_id: number;
  unit_id: number;
  status: number;
  page: number;
  per_page: number;
  order_by: string;
  order_type: string;
};

export type Product = {
  product_id: number;
  name: string;
  description?: string;
  stock: number;
  created_at?: Date | string;
  status: number;
  category_id: number;
  retail_price: number;
  wholesale_price: number;
  image_url?: string | null;
  unit_id?: number;
  size_id?: number;
  code?: string;
  sku?: string;

  // relations
  categories?: Category;
  sizes?: Size;
  units?: Unit;

  // new columns
  raw_price?: number;
  inventory?: Inventory;
  price_list?: PriceList;
};

export type Inventory = {
  [key: string]: {
    branch_id: string;
    stock: number;
    min_stock?: number;
    max_stock?: number;
  };
};

export type PriceList = {
  [key: string]: {
    price_id: string;
    unit_price: number;
    is_default: boolean;
  };
};

export type Category = {
  key?: number;
  category_id?: number;
  name?: string;
  description?: string;
  status?: number;
};

export type Size = {
  size_id?: number;
  created_at: string | Date;
  name: string;
  short_name: string;
  description?: string;
  key?: number;
};

export type Sizes = {
  selected?: Size;
  drawer?: 'new' | 'edit' | null;
  pagination?: Pagination;
  data?: Size[];
};

export type Unit = {
  key?: number;
  unit_id?: number;
  created_at: string | Date;
  name: string;
  short_name: string;
  description?: string;
};

export type Units = {
  selected?: Unit;
  drawer?: 'new' | 'edit' | null;
  pagination?: Pagination;
  data?: Unit[];
};
