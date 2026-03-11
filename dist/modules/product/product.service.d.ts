import type { ProductDatabase, ProductEntity, ProductListQuery } from "./product.database.js";
export declare class ProductService {
    private readonly productDb;
    constructor(productDb: ProductDatabase);
    create(input: {
        sku: string;
        title: string;
        description: string;
        price: number;
        currency: "USD" | "VND";
        category: string;
        tags: string[];
        status?: "active" | "inactive";
    }): Promise<ProductEntity>;
    updateById(id: string, input: Partial<{
        sku: string;
        title: string;
        description: string;
        price: number;
        currency: "USD" | "VND";
        category: string;
        tags: string[];
        status: "active" | "inactive";
    }>): Promise<ProductEntity>;
    findById(id: string): Promise<ProductEntity>;
    deleteById(id: string): Promise<void>;
    list(query: ProductListQuery): Promise<{
        data: ProductEntity[];
        total: number;
    }>;
}
//# sourceMappingURL=product.service.d.ts.map