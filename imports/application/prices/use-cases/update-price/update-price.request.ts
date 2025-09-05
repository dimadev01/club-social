export interface UpdatePriceCategoryRequest {
  amount: number;
  id: string;
}

export interface UpdatePriceRequest {
  categories: UpdatePriceCategoryRequest[];
  id: string;
}
