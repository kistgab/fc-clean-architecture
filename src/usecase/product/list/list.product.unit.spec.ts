import Product from "../../../domain/product/entity/product";
import { InputListCustomerDto } from "../../customer/list/list.customer.dto";
import { OutputListProductDto } from "./list.product.dto";
import ListProductUseCase from "./list.product.usecase";

const product = new Product("MockedId", "Black fancy chair", 299.9);
const product2 = new Product("MockedId2", "White fancy chair", 199.9);
const MockRepository = () => {
  return {
    find: jest.fn(),
    findAll: jest.fn().mockReturnValue(Promise.resolve([product, product2])),
    create: jest.fn(),
    update: jest.fn(),
  };
};

describe("Unit Test list products use case", () => {
  it("should list all products", async () => {
    const repository = MockRepository();
    const useCase = new ListProductUseCase(repository);
    const input: InputListCustomerDto = {};
    const output: OutputListProductDto = { products: [product, product2] };

    const result = await useCase.execute(input);

    expect(result).toEqual(output);
  });

  it("should return an empty array if there's no products", async () => {
    const repository = MockRepository();
    repository.findAll = jest.fn().mockReturnValueOnce([]);
    const useCase = new ListProductUseCase(repository);
    const input: InputListCustomerDto = {};
    const output: OutputListProductDto = { products: [] };

    const result = await useCase.execute(input);

    expect(result).toEqual(output);
  });
});
