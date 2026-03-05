import { verifyPassword } from "../../utils/crypto.js";
import { ApiError } from "../../utils/http.js";
import { signAccessToken, signRefreshToken } from "../../utils/jwt.js";
import crypto from "crypto";
import { env } from "../../config/env.js";
function randomTokenId() {
    return crypto.randomUUID();
}
export class AuthService {
    authDb;
    userDb;
    constructor(authDb, userDb) {
        this.authDb = authDb;
        this.userDb = userDb;
    }
    async login(input) {
        const email = input.email.trim().toLowerCase();
        const user = await this.userDb.findByEmail(email);
        if (!user)
            throw new ApiError(404, { message: "Email not found" });
        const ok = await verifyPassword(input.password, user.passwordHash);
        if (!ok)
            throw new ApiError(401, {
                message: "Password is not correct",
            });
        const accessToken = signAccessToken({
            sub: user._id.toString(),
            role: user.role,
        });
        const tokenId = randomTokenId();
        const now = new Date();
        const expiresAt = new Date(now.getTime() + env.refreshTokenTltSeconds * 1000);
        const doc = {
            userId: user._id,
            tokenId,
            issuedAt: now,
            expiresAt,
        };
        const refreshToken = signRefreshToken({
            sub: user._id.toString(),
            jti: tokenId,
        });
        await this.authDb.insert(doc);
        return { accessToken, refreshToken };
    }
    async refresh() { }
    async logout() { }
}
//# sourceMappingURL=auth.service.js.map