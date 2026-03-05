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
}
//# sourceMappingURL=user.database.js.map