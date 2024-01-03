import Product from "../../../domain/product/entity/product";
import { InputFindProductDto, OutputFindProductDto } from "./find.product.dto";
import FindProductUseCase from "./find.product.usecase";

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
  it("should find the user correctly", async () => {
    const productRepository = MockRepository();
    const useCase = new FindProductUseCase(productRepository);
    const input: InputFindProductDto = {
      id: "MockedId",
    };
    const expectedOutput: OutputFindProductDto = {
      id: "MockedId",
      name: "Black fancy chair",
      price: 299.9,
    };

    const result = await useCase.execute(input);

    expect(result).toEqual(expectedOutput);
  });

  it("should throw an exception when the product was not found", async () => {
    const productRepository = MockRepository();
    const useCase = new FindProductUseCase(productRepository);
    const input: InputFindProductDto = {
      id: "Non-ExistingId",
    };
    productRepository.find.mockImplementationOnce(() => {
      throw new Error("Product not found.");
    });

    expect(async () => await useCase.execute(input)).rejects.toThrowError(
      "Product not found"
    );
  });
});
