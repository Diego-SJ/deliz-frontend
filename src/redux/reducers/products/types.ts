import { Pagination } from '@supabase/supabase-js';

export type ProductsSlice = {
  products: Product[];
  categories: Category[];
  current_product: Product;
  current_category: Category;
  sizes?: Sizes;
  units?: Units;
  loading: boolean;
};

export type Product = {
  key?: number;
  product_id: number;
  name: string;
  description?: string;
  stock: number;
  created_at?: Date | string;
  status: number;
  category_id: number;
  retail_price: number;
  wholesale_price: number;
  image_url?: string;
  unit_id?: number;
  size_id?: number;
  code?: string;
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
