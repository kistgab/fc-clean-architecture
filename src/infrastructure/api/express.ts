import express, { Express } from "express";
import { Sequelize } from "sequelize-typescript";
import CustomerModel from "../customer/repository/sequelize/customer.model";
import ProductModel from "../product/repository/sequelize/product.model";
import { customerRoute } from "./routes/customer.route";
import { productsRoute } from "./routes/products.route";

export const app: Express = express();
app.use(express.json());
app.use("/customer", customerRoute);
app.use("/products", productsRoute);

export let sequelize: Sequelize;

async function setupDb() {
  sequelize = new Sequelize({
    dialect: "sqlite",
    storage: ":memory:",
    logging: false,
  });
  await sequelize.addModels([CustomerModel, ProductModel]);
  await sequelize.sync();
}
setupDb();
