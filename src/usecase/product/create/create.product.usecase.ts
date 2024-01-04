import Product from "../../../domain/product/entity/product";
import ProductFactory from "../../../domain/product/factory/product.factory";
import ProductRepositoryInterface from "../../../domain/product/repository/product-repository.interface";
import {
  InputCreateProductDto,
  OutputCreateProductDto,
} from "./create.product.dto";

export class CreateProductUseCase {
  constructor(private productRepository: ProductRepositoryInterface) {}

  async executar(
    input: InputCreateProductDto
  ): Promise<OutputCreateProductDto> {
    const info = ProductFactory.create(input.type, input.name, input.price);
    const product = new Product(info.id, info.name, info.price);
    this.productRepository.create(product);
    return {
      id: product.id,
    };
  }
}
