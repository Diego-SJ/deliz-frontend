export const PROFILE_PIC =
  'https://xsgames.co/randomusers/avatar.php?g=pixel&key=1';

export const CATEGORIES = [
  { id: 1, name: 'Paleta de agua' },
  { id: 2, name: 'Paleta de crema' },
  { id: 3, name: 'Cubierta de chocolate' },
  { id: 4, name: 'Helado' },
  { id: 5, name: 'Nieve' },
  { id: 6, name: 'Sandwich' },
  { id: 7, name: 'Bolis' },
  { id: 8, name: 'Materia prima' },
  { id: 9, name: 'Paleta mini agua' },
  { id: 10, name: 'Paleta mini crema' },
  { id: 11, name: 'Pastes' },
];

export const EXTRA_ITEM_BASE = {
  name: 'Extra',
  category_id: 7, // extra
  product_id: 0,
  retail_price: 0,
  status: 2,
  stock: 0,
  wholesale_price: 0,
  created_at: new Date(),
  description: 'Producto pivote',
};
