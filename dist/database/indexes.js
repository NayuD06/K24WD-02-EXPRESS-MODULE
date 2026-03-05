import { getDb } from "./mongo.js";
export async function ensureIndexes() {
    const db = getDb();
    // Users: unique email
    await db.collection("users").createIndex({ email: 1 }, { unique: true });
    // Product: text index cho Search(tittle, description)
    await db
        .collection("products")
        .createIndex({ title: "text", description: "text" }, { name: "products_text_search" });
    // Refresh Token: Search nhanh theo UserId & TokenId
    (await db
        .collection("refresh_tokens")
        .createIndex({ userId: 1, revokeAt: 1, expiresAt: 1 }),
        { name: "rt_user_active" });
    // Chat message: timeline
    await db
        .collection("chat_messages")
        .createIndex({ createdAt: -1 }, { name: "chat_timeline" });
}
//# sourceMappingURL=indexes.js.map