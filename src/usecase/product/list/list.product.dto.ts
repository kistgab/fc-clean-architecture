export interface InputListProductDto {}

type Product = {
  price: number;
  name: string;
  id: string;
};

export interface OutputListProductDto {
  products: Product[];
}
