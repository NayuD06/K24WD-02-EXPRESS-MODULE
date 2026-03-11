import { ObjectId } from "mongodb";
import { getDb } from "../../database/mongo.js";
export class ProductDatabase {
    col() {
        return getDb().collection("products");
    }
    async create(doc) {
        const res = await this.col().insertOne(doc);
        return { _id: res.insertedId, ...doc };
    }
    async updateById(id, update) {
        await this.col().updateOne({ _id: new ObjectId(id) }, { $set: update });
        return this.findById(id);
    }
    async findById(id) {
        return this.col().findOne({ _id: new ObjectId(id) });
    }
    async deleteById(id) {
        const res = await this.col().deleteOne({ _id: new ObjectId(id) });
        return res.deletedCount === 1;
    }
    async list(query) {
        const filter = {};
        if (query.q) {
            filter.$or = [
                { title: { $regex: query.q, $options: "i" } },
                { description: { $regex: query.q, $options: "i" } },
            ];
        }
        if (query.category)
            filter.category = query.category;
        if (query.tags && query.tags.length > 0)
            filter.tags = { $all: query.tags };
        if (query.status)
            filter.status = query.status;
        if (query.minPrice !== undefined || query.maxPrice !== undefined) {
            filter.price = {};
            if (query.minPrice !== undefined)
                filter.price.$gte = query.minPrice;
            if (query.maxPrice !== undefined)
                filter.price.$lte = query.maxPrice;
        }
        let sort = { createdAt: -1 };
        if (query.sort === "price_asc")
            sort = { price: 1 };
        else if (query.sort === "price_desc")
            sort = { price: -1 };
        const page = query.page ?? 1;
        const limit = query.limit ?? 20;
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            this.col().find(filter).sort(sort).skip(skip).limit(limit).toArray(),
            this.col().countDocuments(filter),
        ]);
        return { data, total };
    }
}
//# sourceMappingURL=product.database.js.map