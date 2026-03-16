import { apiAuthClient, apiClient } from './api-client';

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
  averageRating: number;
  reviewCount: number;
  dietary?: {
    vegan: boolean;
    glutenFree: boolean;
  };
};

type ProductReview = {
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  updatedAt: string;
};

type SaveProductReviewResponse = {
  data: {
    productId: string;
    averageRating: number;
    reviewCount: number;
    review: ProductReview | null;
  };
};

type ProductListResponse = {
  data: ApiProduct[];
};

export const listProducts = async () => {
  const response = await apiClient.get<ProductListResponse>('/api/products');

  return response.data.data;
};

export const saveProductReview = async (productId: string, payload: { rating: number; comment?: string }) => {
  const response = await apiAuthClient.post<SaveProductReviewResponse>(`/api/products/${productId}/reviews`, payload);

  return response.data;
};
