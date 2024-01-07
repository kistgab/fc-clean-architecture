import express, { Request, Response } from "express";
import { InputCreateProductDto } from "../../../usecase/product/create/create.product.dto";
import { CreateProductUseCase } from "../../../usecase/product/create/create.product.usecase";
import ListProductUseCase from "../../../usecase/product/list/list.product.usecase";
import ProductRepository from "../../product/repository/sequelize/product.repository";

export const productsRoute = express.Router();

productsRoute.post("/", async (req: Request, res: Response) => {
  const useCase = new CreateProductUseCase(new ProductRepository());
  try {
    const productDto: InputCreateProductDto = {
      name: req.body.name,
      price: req.body.price,
      type: req.body.type,
    };
    const output = await useCase.execute(productDto);
    res.send(output);
  } catch (err) {
    res.status(500).send(err);
  }
});

productsRoute.get("/", async (req: Request, res: Response) => {
  const useCase = new ListProductUseCase(new ProductRepository());
  try {
    const output = await useCase.execute({});
    res.send(output);
  } catch (err) {
    res.status(500).send(err);
  }
});
