import { ok } from "../../utils/http.js";
export class ProductController {
    productService;
    constructor(productService) {
        this.productService = productService;
    }
    list = async (req, res) => {
        const query = {};
        if (req.query.q)
            query.q = req.query.q;
        if (req.query.category)
            query.category = req.query.category;
        if (req.query.status)
            query.status = req.query.status;
        if (req.query.tags)
            query.tags = req.query.tags.split(",");
        if (req.query.minPrice)
            query.minPrice = Number(req.query.minPrice);
        if (req.query.maxPrice)
            query.maxPrice = Number(req.query.maxPrice);
        if (req.query.sort)
            query.sort = req.query.sort;
        if (req.query.page)
            query.page = Number(req.query.page);
        if (req.query.limit)
            query.limit = Number(req.query.limit);
        const result = await this.productService.list(query);
        res.json(ok(result));
    };
    findById = async (req, res) => {
        const id = req.params.id;
        const product = await this.productService.findById(id);
        res.json(ok(product));
    };
    create = async (req, res) => {
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
    update = async (req, res) => {
        const id = req.params.id;
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
    delete = async (req, res) => {
        const id = req.params.id;
        await this.productService.deleteById(id);
        res.status(204).end();
    };
}
//# sourceMappingURL=product.controller.js.map