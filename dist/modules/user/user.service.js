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
        // NOTE: BTVN Bắt người dùng phải nhập 1 kí hiệu đặt biệt và viết hoa 1 chứ cái
        if (!/[A-Z]/.test(password)) {
            throw new ApiError(400, { message: "Password must contain at least 1 uppercase letter" });
        }
        // NOTE: BTVN Bắt lỗi email tồn tại rồi 
        if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
            throw new ApiError(400, { message: "Password must contain at least 1 special character" });
        }
        const existingUser = await this.userDb.findByEmail(email);
        if (existingUser) {
            throw new ApiError(409, { message: "Email already exists" });
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
    // PUT
    async replace(id, input) {
        const existing = await this.userDb.findById(id);
        if (!existing)
            throw new ApiError(404, { message: "User not found" });
        const email = input.email.trim().toLowerCase();
        if (!email.includes("@"))
            throw new ApiError(400, { message: "Email must include @" });
        const dup = await this.userDb.findByEmail(email);
        if (dup && dup._id.toHexString() !== id)
            throw new ApiError(409, { message: "Email already exists" });
        const pwd = input.password.trim();
        if (pwd.length < 6)
            throw new ApiError(400, { message: "Password must be at least 6 characters" });
        if (!/[A-Z]/.test(pwd))
            throw new ApiError(400, { message: "Password must contain at least 1 uppercase letter" });
        if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd))
            throw new ApiError(400, { message: "Password must contain at least 1 special character" });
        const hashPwd = await hashPassword(pwd);
        const user = await this.userDb.updateOne(id, {
            email,
            passwordHash: hashPwd,
            role: input.role,
            updatedAt: new Date(),
        });
        if (!user)
            throw new ApiError(404, { message: "User not found" });
        return user;
    }
    // PATCH
    async update(id, input) {
        const update = {};
        if (input.email) {
            const email = input.email.trim().toLowerCase();
            if (!email.includes("@"))
                throw new ApiError(400, { message: "Email must include @" });
            const existing = await this.userDb.findByEmail(email);
            if (existing && existing._id.toHexString() !== id) {
                throw new ApiError(409, { message: "Email already exists" });
            }
            update.email = email;
        }
        if (input.password) {
            const pwd = input.password.trim();
            if (pwd.length < 6)
                throw new ApiError(400, { message: "Password must be at least 6 characters" });
            if (!/[A-Z]/.test(pwd))
                throw new ApiError(400, { message: "Password must contain at least 1 uppercase letter" });
            if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd))
                throw new ApiError(400, { message: "Password must contain at least 1 special character" });
            update.passwordHash = await hashPassword(pwd);
        }
        if (input.role)
            update.role = input.role;
        update.updatedAt = new Date();
        const user = await this.userDb.updateOne(id, update);
        if (!user)
            throw new ApiError(404, { message: "User not found" });
        return user;
    }
    async delete(id) {
        const ok = await this.userDb.deleteOne(id);
        if (!ok)
            throw new ApiError(404, { message: "User not found" });
    }
}
//# sourceMappingURL=user.service.js.map