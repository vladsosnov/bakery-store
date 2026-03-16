export type Category = 'All' | 'Bread' | 'Cakes' | 'Pastries' | 'Cookies';
export type ProductTag = 'All' | string;
export type ShopFilterName = 'veganOnly' | 'glutenFreeOnly' | 'underTwenty';

export type Product = {
  id: string;
  name: string;
  category: Exclude<Category, 'All'>;
  price: number;
  stock: number;
  image: string;
  description: string;
  tags: string[];
  dietary: {
    vegan: boolean;
    glutenFree: boolean;
  };
  averageRating: number;
  reviewCount: number;
};
