export const BUCKETS = {
  PRODUCTS: {
    IMAGES: (_: TemplateStringsArray, path: string) => `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/${path}`,
    IMAGES_PATH: `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/deliz/products/images/`,
  },
  COMPANY: {
    LOGO: (_: TemplateStringsArray, path: string) => `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/${path}`,
  },
};
