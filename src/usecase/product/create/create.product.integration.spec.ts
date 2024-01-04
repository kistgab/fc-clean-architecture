import { Sequelize } from "sequelize-typescript";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import { InputCreateProductDto } from "./create.product.dto";
import { CreateProductUseCase } from "./create.product.usecase";

describe("Test find product use case", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.drop();
    await sequelize.addModels([ProductModel]);
    await sequelize.sync();
  });

  it("should create a product", async () => {
    const productRepository = new ProductRepository();
    const usecase = new CreateProductUseCase(productRepository);
    const input: InputCreateProductDto = {
      name: "MyCreatedProduct",
      price: 399.9,
      type: "a",
    };

    const result = await usecase.execute(input);

    expect(result.id).toBeDefined();
    expect(productRepository.find(result.id)).toBeDefined();
  });

  it("should not create a product when the name is invalid", async () => {
    const productRepository = new ProductRepository();
    const usecase = new CreateProductUseCase(productRepository);
    const input: InputCreateProductDto = {
      name: "",
      price: 399.9,
      type: "a",
    };
    expect(async () => await usecase.execute(input)).rejects.toThrow();
    const allProducts = await productRepository.findAll();
    expect(allProducts.length).toBe(0);
  });

  it("should not create a product when the price is invalid", async () => {
    const productRepository = new ProductRepository();
    const usecase = new CreateProductUseCase(productRepository);
    const input: InputCreateProductDto = {
      name: "name",
      price: -1,
      type: "a",
    };
    expect(async () => await usecase.execute(input)).rejects.toThrow();
    const allProducts = await productRepository.findAll();
    expect(allProducts.length).toBe(0);
  });

  it("should not create a product when the type is invalid", async () => {
    const productRepository = new ProductRepository();
    const usecase = new CreateProductUseCase(productRepository);
    const input: InputCreateProductDto = {
      name: "name",
      price: -1,
      type: "9",
    };
    expect(async () => await usecase.execute(input)).rejects.toThrow();
    const allProducts = await productRepository.findAll();
    expect(allProducts.length).toBe(0);
  });
});
