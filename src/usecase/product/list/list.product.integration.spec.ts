import { Sequelize } from "sequelize-typescript";
import Product from "../../../domain/product/entity/product";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import { InputListProductDto, OutputListProductDto } from "./list.product.dto";
import ListProductUseCase from "./list.product.usecase";

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

  it("should list all the products that are in the database", async () => {
    const product1 = new Product("randomUuid1", "name1", 300);
    const product2 = new Product("randomUuid2", "name2", 300);
    const productRepository = new ProductRepository();
    productRepository.create(product1);
    productRepository.create(product2);
    const usecase = new ListProductUseCase(productRepository);
    const input: InputListProductDto = {};
    const output: OutputListProductDto = {
      products: [
        { id: product1.id, name: product1.name, price: product1.price },
        { id: product2.id, name: product2.name, price: product2.price },
      ],
    };

    const result = await usecase.execute(input);

    expect(result).toEqual(output);
  });

  it("should list an empty array if there's no products in the database", async () => {
    const productRepository = new ProductRepository();
    const usecase = new ListProductUseCase(productRepository);
    const input: InputListProductDto = {};
    const output: OutputListProductDto = {
      products: [],
    };

    const result = await usecase.execute(input);

    expect(result).toEqual(output);
  });
});
