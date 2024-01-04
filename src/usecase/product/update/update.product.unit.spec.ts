import Product from "../../../domain/product/entity/product";
import {
  InputUpdateProductDto,
  OutputUpdateProductDto,
} from "./update.product.dto";
import UpdateProductUseCase from "./update.product.usecase";

const initialProduct = new Product("MockedId", "White fancy chair", 199.9);
const updatedProduct = new Product(initialProduct.id, "different name", 500);
const MockRepository = () => {
  return {
    find: jest
      .fn()
      .mockReturnValueOnce(initialProduct)
      .mockReturnValueOnce(updatedProduct),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  };
};

describe("Unit Tests update product use case", () => {
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
    const useCase = new UpdateProductUseCase(productRepository);

    expect(async () => await useCase.execute(input)).rejects.toThrowError(
      "Name is required"
    );
  });

  it("should not update the product when the price is invalid", async () => {
    const productRepository = MockRepository();
    const input: InputUpdateProductDto = {
      id: initialProduct.id,
      name: "different name",
      price: -1,
    };
    const useCase = new UpdateProductUseCase(productRepository);

    expect(async () => await useCase.execute(input)).rejects.toThrowError(
      "Price must be greater than zero"
    );
  });

  it("should not update the product when the id doesnt exists in the dabase", async () => {
    const productRepository = MockRepository();
    const input: InputUpdateProductDto = {
      id: "id that doenst exists",
      name: "different name",
      price: 500,
    };
    jest.spyOn(productRepository, "update").mockImplementation(() => {
      throw new Error("Sequelize error during update");
    });
    const useCase = new UpdateProductUseCase(productRepository);

    expect(async () => await useCase.execute(input)).rejects.toThrowError(
      "Sequelize error during update"
    );
  });
});
