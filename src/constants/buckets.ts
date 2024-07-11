export const BUCKETS = {
  PRODUCTS: {
    IMAGES: (_: TemplateStringsArray, path: string) =>
      `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/deliz/${path}`,
    IMAGES_PATH: (_: TemplateStringsArray, path: string) =>
      `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/deliz/products/images/${path}`,
  },
  COMPANY: {
    LOGO: (_: TemplateStringsArray, path: string) => `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/${path}`,
  },
};
