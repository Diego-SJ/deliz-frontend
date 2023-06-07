export type ProductsSlice = {
  products: Product[];
  current_product: Product;
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
};

export type Category = {
  key?: number;
  category_id?: number;
  name?: string;
  description?: string;
};
