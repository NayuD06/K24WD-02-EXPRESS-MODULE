import { ObjectId, type Filter, type Sort } from "mongodb";
import { getDb } from "../../database/mongo.js";
import type { ProductDoc } from "./product.model.js";

export type ProductEntity = ProductDoc & { _id: ObjectId };

export type ProductListQuery = {
  q?: string;

  category?: string;
  tags?: string[];
  status?: "active" | "inactive";

  minPrice?: number;
  maxPrice?: number;

  sort?: "newest" | "price_asc" | "price_desc";
  page?: number;
  limit?: number;
};

export class ProductDatabase {
  private col() {
    return getDb().collection<ProductDoc>("products");
  }

  async create(doc: ProductDoc): Promise<ProductEntity> {
    const res = await this.col().insertOne(doc);
    return { _id: res.insertedId, ...doc };
  }

  async updateById(id: string, update: Partial<ProductDoc>): Promise<ProductEntity | null> {
    await this.col().updateOne({ _id: new ObjectId(id) }, { $set: update });
    return this.findById(id);
  }

  async findById(id: string): Promise<ProductEntity | null> {
    return this.col().findOne({ _id: new ObjectId(id) }) as Promise<ProductEntity | null>;
  }

  async deleteById(id: string): Promise<boolean> {
    const res = await this.col().deleteOne({ _id: new ObjectId(id) });
    return res.deletedCount === 1;
  }

  async list(query: ProductListQuery): Promise<{ data: ProductEntity[]; total: number }> {
    const filter: Filter<ProductDoc> = {};

    if (query.q) {
      filter.$or = [
        { title: { $regex: query.q, $options: "i" } },
        { description: { $regex: query.q, $options: "i" } },
      ];
    }
    if (query.category) filter.category = query.category;
    if (query.tags && query.tags.length > 0) filter.tags = { $all: query.tags };
    if (query.status) filter.status = query.status;
    if (query.minPrice !== undefined || query.maxPrice !== undefined) {
      filter.price = {};
      if (query.minPrice !== undefined) (filter.price as Record<string, number>).$gte = query.minPrice;
      if (query.maxPrice !== undefined) (filter.price as Record<string, number>).$lte = query.maxPrice;
    }

    let sort: Sort = { createdAt: -1 };
    if (query.sort === "price_asc") sort = { price: 1 };
    else if (query.sort === "price_desc") sort = { price: -1 };

    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.col().find(filter).sort(sort).skip(skip).limit(limit).toArray() as Promise<ProductEntity[]>,
      this.col().countDocuments(filter),
    ]);

    return { data, total };
  }
}