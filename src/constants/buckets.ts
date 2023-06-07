export const BUCKETS = {
  PRODUCTS: {
    IMAGES: (_: TemplateStringsArray, path: string) =>
      `https://maavzvodgeradikmoehp.supabase.co/storage/v1/object/public/deliz/${path}`,
  },
};
