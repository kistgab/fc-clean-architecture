import { Sequelize } from "sequelize-typescript";
import Product from "../../../domain/product/entity/product";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import { OutputFindProductDto } from "./find.product.dto";
import FindProductUseCase from "./find.product.usecase";

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

  it("should find a product", async () => {
    const productRepository = new ProductRepository();
    const usecase = new FindProductUseCase(productRepository);
    const product = new Product("randomUuid", "name", 300);
    await productRepository.create(product);
    const input = {
      id: "randomUuid",
    };
    const output: OutputFindProductDto = {
      id: "randomUuid",
      name: "name",
      price: 300,
    };

    const result = await usecase.execute(input);

    expect(result).toEqual(output);
  });

  // TODO: Remove skip and fix the test
  it.skip("should throw an exception when the product was not found", async () => {
    const productRepository = new ProductRepository();
    const usecase = new FindProductUseCase(productRepository);
    const input = {
      id: "non-existing-id",
    };

    expect(async () => await usecase.execute(input)).rejects.toThrowError("~");
  });
});
