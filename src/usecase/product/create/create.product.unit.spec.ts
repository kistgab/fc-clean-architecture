import Product from "../../../domain/product/entity/product";
import ProductFactory from "../../../domain/product/factory/product.factory";
import {
  InputCreateProductDto,
  OutputCreateProductDto,
} from "./create.product.dto";
import { CreateProductUseCase } from "./create.product.usecase";

const product = new Product("MockedId", "Black fancy chair", 299.9);
const MockRepository = () => {
  return {
    find: jest.fn().mockReturnValue(Promise.resolve(product)),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  };
};

describe("Unit Test find product use case", () => {
  it("should create the product with success for type A", async () => {
    const productRepository = MockRepository();
    const useCase = new CreateProductUseCase(productRepository);
    const input: InputCreateProductDto = {
      name: product.name,
      price: product.price,
      type: "a",
    };
    jest.spyOn(ProductFactory, "create").mockReturnValueOnce(product);
    const output: OutputCreateProductDto = {
      id: "MockedId",
    };

    const result = await useCase.execute(input);

    expect(result).toEqual(output);
  });

  it("should create the product with success for type B", async () => {
    const productRepository = MockRepository();
    const useCase = new CreateProductUseCase(productRepository);
    const input: InputCreateProductDto = {
      name: product.name,
      price: product.price,
      type: "b",
    };
    jest.spyOn(ProductFactory, "create").mockReturnValueOnce(product);
    const output: OutputCreateProductDto = {
      id: "MockedId",
    };

    const result = await useCase.execute(input);

    expect(result).toEqual(output);
  });

  it("should throw when the name is missing", async () => {
    const productRepository = MockRepository();
    const useCase = new CreateProductUseCase(productRepository);
    const input: InputCreateProductDto = {
      name: "",
      price: product.price,
      type: "a",
    };

    await expect(useCase.execute(input)).rejects.toThrowError(
      "Name is required"
    );
  });

  it("should throw when the price is lower than 0", async () => {
    const productRepository = MockRepository();
    const useCase = new CreateProductUseCase(productRepository);
    const input: InputCreateProductDto = {
      name: "name",
      price: -1,
      type: "a",
    };

    await expect(useCase.execute(input)).rejects.toThrowError(
      "Price must be greater than zero"
    );
  });

  it("should throw when the type is wrong", async () => {
    const productRepository = MockRepository();
    const useCase = new CreateProductUseCase(productRepository);
    const input: InputCreateProductDto = {
      name: product.name,
      price: product.price,
      type: "not-found-type",
    };

    await expect(useCase.execute(input)).rejects.toThrowError(
      "Product type not supported"
    );
  });
});
