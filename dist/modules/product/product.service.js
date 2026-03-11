import { ApiError } from "../../utils/http.js";
export class ProductService {
    productDb;
    constructor(productDb) {
        this.productDb = productDb;
    }
    async create(input) {
        if (!input.sku?.trim())
            throw new ApiError(400, { message: "SKU is required" });
        if (!input.title?.trim())
            throw new ApiError(400, { message: "Title is required" });
        if (input.price < 0)
            throw new ApiError(400, { message: "Price must be >= 0" });
        const now = new Date();
        const doc = {
            sku: input.sku.trim(),
            title: input.title.trim(),
            description: input.description ?? "",
            price: input.price,
            currency: input.currency,
            category: input.category ?? "",
            tags: input.tags ?? [],
            status: input.status ?? "active",
            createdAt: now,
            updatedAt: now,
        };
        return this.productDb.create(doc);
    }
    async updateById(id, input) {
        const existing = await this.productDb.findById(id);
        if (!existing)
            throw new ApiError(404, { message: "Product not found" });
        if (input.price !== undefined && input.price < 0) {
            throw new ApiError(400, { message: "Price must be >= 0" });
        }
        const update = { ...input, updatedAt: new Date() };
        const product = await this.productDb.updateById(id, update);
        if (!product)
            throw new ApiError(404, { message: "Product not found" });
        return product;
    }
    async findById(id) {
        const product = await this.productDb.findById(id);
        if (!product)
            throw new ApiError(404, { message: "Product not found" });
        return product;
    }
    async deleteById(id) {
        const ok = await this.productDb.deleteById(id);
        if (!ok)
            throw new ApiError(404, { message: "Product not found" });
    }
    async list(query) {
        return this.productDb.list(query);
    }
}
//# sourceMappingURL=product.service.js.map