export interface ProductDetails {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export type ProductPayload = Pick<
  ProductDetails,
  "name" | "description" | "price" | "stock"
>;
