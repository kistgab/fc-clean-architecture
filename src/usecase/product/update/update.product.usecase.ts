import ProductRepositoryInterface from "../../../domain/product/repository/product-repository.interface";
import {
  InputUpdateProductDto,
  OutputUpdateProductDto,
} from "./update.product.dto";

export default class UpdateProductUseCase {
  constructor(private productRepository: ProductRepositoryInterface) {}

  async execute(input: InputUpdateProductDto): Promise<OutputUpdateProductDto> {
    const productToUpdate = await this.productRepository.find(input.id);
    productToUpdate.changeName(input.name);
    productToUpdate.changePrice(input.price);
    this.productRepository.update(productToUpdate);
    return {
      id: productToUpdate.id,
      name: productToUpdate.name,
      price: productToUpdate.price,
    };
  }
}
