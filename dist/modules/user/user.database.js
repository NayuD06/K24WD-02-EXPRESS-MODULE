import { ObjectId } from "mongodb";
import { getDb } from "../../database/mongo.js";
export class UserDatabase {
    col() {
        return getDb().collection("users");
    }
    async list() {
        return this.col().find({}).limit(50).toArray();
    }
    async findByEmail(email) {
        return this.col().findOne({ email });
    }
    async findById(id) {
        return this.col().findOne({ _id: new ObjectId(id) });
    }
    async create(doc) {
        const res = await this.col().insertOne(doc);
        return { _id: res.insertedId, ...doc };
    }
    async insertMany(docs) {
        const res = await this.col().insertMany(docs);
        return docs.map((doc, i) => ({ _id: res.insertedIds[i], ...doc }));
    }
    async updateOne(id, update) {
        await this.col().updateOne({ _id: new ObjectId(id) }, { $set: update });
        return this.findById(id);
    }
    async deleteOne(id) {
        const res = await this.col().deleteOne({ _id: new ObjectId(id) });
        return res.deletedCount === 1;
    }
}
//# sourceMappingURL=user.database.js.map