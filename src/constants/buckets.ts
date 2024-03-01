export const BUCKETS = {
  PRODUCTS: {
    IMAGES: (_: TemplateStringsArray, path: string) =>
      `https://maavzvodgeradikmoehp.supabase.co/storage/v1/object/public/deliz/${path}`,
    IMAGES_PATH: (_: TemplateStringsArray, path: string) =>
      `https://maavzvodgeradikmoehp.supabase.co/storage/v1/object/public/deliz/products/images/${path}`,
  },
};
