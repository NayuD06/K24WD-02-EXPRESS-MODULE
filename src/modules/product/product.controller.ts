import type { Request, Response } from "express";
import type { ProductService } from "./product.service.js";
import { ok } from "../../utils/http.js";
import type { ProductListQuery } from "./product.database.js";

export class ProductController {
  constructor(private readonly productService: ProductService) {}

  list = async (req: Request, res: Response) => {
    const query: ProductListQuery = {};
    if (req.query.q) query.q = req.query.q as string;
    if (req.query.category) query.category = req.query.category as string;
    if (req.query.status) query.status = req.query.status as "active" | "inactive";
    if (req.query.tags) query.tags = (req.query.tags as string).split(",");
    if (req.query.minPrice) query.minPrice = Number(req.query.minPrice);
    if (req.query.maxPrice) query.maxPrice = Number(req.query.maxPrice);
    if (req.query.sort) query.sort = req.query.sort as "newest" | "price_asc" | "price_desc";
    if (req.query.page) query.page = Number(req.query.page);
    if (req.query.limit) query.limit = Number(req.query.limit);

    const result = await this.productService.list(query);
    res.json(ok(result));
  };

  findById = async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const product = await this.productService.findById(id);
    res.json(ok(product));
  };

  create = async (req: Request, res: Response) => {
    const { sku, title, description, price, currency, category, tags, status } = req.body;
    const product = await this.productService.create({
      sku,
      title,
      description,
      price,
      currency,
      category,
      tags,
      status,
    });
    res.status(201).json(ok(product));
  };

  update = async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const { sku, title, description, price, currency, category, tags, status } = req.body;
    const product = await this.productService.updateById(id, {
      sku,
      title,
      description,
      price,
      currency,
      category,
      tags,
      status,
    });
    res.json(ok(product));
  };

  delete = async (req: Request, res: Response) => {
    const id = req.params.id as string;
    await this.productService.deleteById(id);
    res.status(204).end();
  };
}
