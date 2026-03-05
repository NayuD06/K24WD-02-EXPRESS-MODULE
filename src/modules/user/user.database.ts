import { ObjectId } from "mongodb";
import { getDb } from "../../database/mongo.js";
import type { UserDoc } from "./user.model.js";

export type UserEntity = UserDoc & { _id: ObjectId };
export class UserDatabase {
  private col() {
    return getDb().collection<UserDoc>("users");
  }

  async list(): Promise<Array<UserEntity>> {
    return this.col().find({}).limit(50).toArray();
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    return this.col().findOne({ email }) as Promise<UserEntity | null>;
  }
  async findById(id: string): Promise<UserEntity | null> {
    return this.col().findOne({ _id: new ObjectId(id) }) as Promise<UserEntity | null>;
  }
  async create(doc:UserDoc): Promise<UserEntity> {
    const res = await this.col().insertOne(doc);
    return { _id: res.insertedId, ...doc };
  }

  async insertMany(docs: UserDoc[]): Promise<Array<UserEntity>> {
    const res = await this.col().insertMany(docs);
    return docs.map((doc, i) => ({ _id: res.insertedIds[i] as ObjectId, ...doc }));
  }

  async updateOne(id: string, update: Partial<UserDoc>): Promise<UserEntity | null> {
    await this.col().updateOne({ _id: new ObjectId(id) }, { $set: update });
    return this.findById(id);
  }

  async deleteOne(id: string): Promise<boolean> {
    const res = await this.col().deleteOne({ _id: new ObjectId(id) });
    return res.deletedCount === 1;
  }
}

