import axios from 'axios';

const apiClient = axios.create({
  headers: {
    'Content-Type': 'application/json'
  }
});

export type ApiProduct = {
  _id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  price: number;
  imageUrl: string;
  tags: string[];
  isAvailable: boolean;
  stock: number;
  dietary?: {
    vegan: boolean;
    glutenFree: boolean;
  };
};

type ProductListResponse = {
  data: ApiProduct[];
};

export const listProducts = async () => {
  const response = await apiClient.get<ProductListResponse>('/api/products');

  return response.data.data;
};
