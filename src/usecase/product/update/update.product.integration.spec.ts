import { Sequelize } from "sequelize-typescript";
import Product from "../../../domain/product/entity/product";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import {
  InputUpdateProductDto,
  OutputUpdateProductDto,
} from "./update.product.dto";
import UpdateProductUseCase from "./update.product.usecase";

describe("Test find product use case", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    sequelize.addModels([ProductModel]);
    await sequelize.sync();
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it("should update the product correctly", async () => {
    const product = new Product("randomUuid", "name", 300);
    const productRepository = new ProductRepository();
    productRepository.create(product);
    const input: InputUpdateProductDto = {
      id: product.id,
      name: "newName",
      price: 500,
    };
    const output: OutputUpdateProductDto = {
      id: product.id,
      name: "newName",
      price: 500,
    };
    const usecase = new UpdateProductUseCase(productRepository);

    const result = await usecase.execute(input);

    const productInDatabase = await productRepository.find(product.id);
    expect(result).toEqual(output);
    expect(productInDatabase.name).toEqual(input.name);
    expect(productInDatabase.price).toEqual(input.price);
  });

  it("should throw an error when the product does not exist", async () => {
    const productRepository = new ProductRepository();
    const input: InputUpdateProductDto = {
      id: "randomUuid",
      name: "newName",
      price: 500,
    };
    const usecase = new UpdateProductUseCase(productRepository);

    await expect(usecase.execute(input)).rejects.toThrow(
      "Product was not found"
    );
  });

  it("should throw an error when the name to update is empty", async () => {
    const product = new Product("randomUuid", "name", 300);
    const productRepository = new ProductRepository();
    productRepository.create(product);
    const input: InputUpdateProductDto = {
      id: product.id,
      name: "",
      price: product.price,
    };
    const usecase = new UpdateProductUseCase(productRepository);

    await expect(usecase.execute(input)).rejects.toThrow("Name is required");
  });

  it("should throw an error when the price to update is lower than zero", async () => {
    const product = new Product("randomUuid", "name", 300);
    const productRepository = new ProductRepository();
    productRepository.create(product);
    const input: InputUpdateProductDto = {
      id: product.id,
      name: product.name,
      price: -1,
    };
    const usecase = new UpdateProductUseCase(productRepository);

    await expect(usecase.execute(input)).rejects.toThrow(
      "Price must be greater than zero"
    );
  });

  it("should throw an error if some error occurs during the database update", async () => {
    const product = new Product("randomUuid", "name", 300);
    const productRepository = new ProductRepository();
    productRepository.create(product);
    const input: InputUpdateProductDto = {
      id: product.id,
      name: "different name",
      price: 500,
    };
    jest.spyOn(productRepository, "update").mockImplementation(() => {
      throw new Error("Some error occurred during update");
    });
    const usecase = new UpdateProductUseCase(productRepository);

    await expect(usecase.execute(input)).rejects.toThrow(
      "Some error occurred during update"
    );
  });
});
