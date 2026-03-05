import { hashPassword } from "../../utils/crypto.js";
import { ApiError } from "../../utils/http.js";
export class UserService {
    userDb;
    // Injection
    constructor(userDb) {
        this.userDb = userDb;
    }
    async list() {
        return this.userDb.list();
    }
    async register(input) {
        const email = input.email.trim().toLowerCase();
        if (!email.includes("@")) {
            throw new ApiError(400, { message: "Email must be include @" });
        }
        const password = input.password.trim();
        if (password.length < 6) {
            throw new ApiError(400, { message: "Password must be at least 6 characters" });
        }
        const existingUser = await this.userDb.findByEmail(email);
        // NOTE: BTVN Bắt người dùng phải nhập 1 kí hiệu đặt biệt và viết hoa 1 chứ cái
        // NOTE: BTVN Bắt lỗi email tồn tại rồi 
        if (existingUser) {
            throw new ApiError(400, { message: "Email already exists" });
        }
        const now = new Date();
        const hashPwd = await hashPassword(password);
        const role = input.role || "customer";
        return this.userDb.create({
            email,
            passwordHash: hashPwd,
            role,
            createdAt: now,
            updatedAt: now,
        });
    }
}
//# sourceMappingURL=user.service.js.map