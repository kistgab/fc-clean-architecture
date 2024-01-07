import Product from "../../../domain/product/entity/product";
import {
  InputUpdateProductDto,
  OutputUpdateProductDto,
} from "./update.product.dto";
import UpdateProductUseCase from "./update.product.usecase";

const MockRepository = () => {
  return {
    find: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  };
};

describe("Unit Tests update product use case", () => {
  let initialProduct: Product;
  let updatedProduct: Product;

  beforeEach(() => {
    initialProduct = new Product("MockedId", "White fancy chair", 199.9);
    updatedProduct = new Product(initialProduct.id, "different name", 500);
  });

  it("should update the product successfully", async () => {
    const productRepository = MockRepository();
    const input: InputUpdateProductDto = {
      id: initialProduct.id,
      name: "different name",
      price: 500,
    };
    const output: OutputUpdateProductDto = {
      id: input.id,
      name: input.name,
      price: input.price,
    };
    jest
      .spyOn(productRepository, "find")
      .mockReturnValueOnce(initialProduct)
      .mockReturnValueOnce(updatedProduct);
    const useCase = new UpdateProductUseCase(productRepository);

    const result = await useCase.execute(input);

    expect(result).toEqual(output);
  });

  it("should not update the product when the name is invalid", async () => {
    const productRepository = MockRepository();
    const input: InputUpdateProductDto = {
      id: initialProduct.id,
      name: "",
      price: 500,
    };
    jest.spyOn(productRepository, "find").mockReturnValueOnce(initialProduct);
    const useCase = new UpdateProductUseCase(productRepository);

    expect(async () => await useCase.execute(input)).rejects.toThrowError(
      "product: Name is required"
    );
  });

  it("should not update the product when the price is invalid", async () => {
    const productRepository = MockRepository();
    const input: InputUpdateProductDto = {
      id: initialProduct.id,
      name: "different name",
      price: -1,
    };
    jest.spyOn(productRepository, "find").mockReturnValueOnce(initialProduct);
    const useCase = new UpdateProductUseCase(productRepository);

    await expect(useCase.execute(input)).rejects.toThrowError(
      "product: Price must be greater than zero"
    );
  }, 5400000);

  it("should not update the product when the id doesnt exists in the dabase", async () => {
    const productRepository = MockRepository();
    const input: InputUpdateProductDto = {
      id: "id that doesnt exists",
      name: "different name",
      price: 500,
    };
    productRepository.find = jest.fn().mockImplementation(() => {
      throw new Error("Product was not found");
    });
    const useCase = new UpdateProductUseCase(productRepository);

    expect(async () => await useCase.execute(input)).rejects.toThrowError(
      "Product was not found"
    );
  });
});
