import request from "supertest";
import { InputCreateProductDto } from "../../../usecase/product/create/create.product.dto";
import { OutputListProductDto } from "../../../usecase/product/list/list.product.dto";
import { app, sequelize } from "../express";

describe("E2E tests for products", () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it("should create a product", async () => {
    const response = await request(app).post("/products").send({
      name: "Product 1",
      price: 100,
      type: "a",
    });

    expect(response.status).toBe(200);
    expect(response.body.id).toBeDefined();
  });

  it("should not create a product when the type is missing", async () => {
    const response = await request(app).post("/products").send({
      name: "Product 1",
      price: 100,
    });

    expect(response.status).toBe(500);
  });

  it("should not create a product when the price is missing", async () => {
    const response = await request(app).post("/products").send({
      name: "Product 1",
    });
    expect(response.status).toBe(500);
  });

  it("should not create a product when the whole body is missing", async () => {
    const response = await request(app).post("/products").send();
    expect(response.status).toBe(500);
  });

  it("should list the products", async () => {
    const product1: InputCreateProductDto = {
      name: "Product 1",
      price: 100,
      type: "a",
    };
    const product2: InputCreateProductDto = {
      name: "Product 1",
      price: 100,
      type: "a",
    };
    const response1 = await request(app).post("/products").send(product1);
    expect(response1.status).toBe(200);
    expect(response1.body.id).toBeDefined();
    const response2 = await request(app).post("/products").send(product2);
    expect(response2.status).toBe(200);
    expect(response2.body.id).toBeDefined();

    const output: OutputListProductDto = {
      products: [
        { id: response1.body.id, name: product1.name, price: product1.price },
        { id: response2.body.id, name: product2.name, price: product2.price },
      ],
    };
    const result = await request(app).get("/products").send();

    expect(result.status).toBe(200);
    expect(result.body).toEqual(output);
  });
});
