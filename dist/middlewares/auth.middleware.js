import { ApiError } from "../utils/http.js";
import { verifyAccessToken } from "../utils/jwt.js";
export function requireAuth(req, res, next) {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
        throw new ApiError(401, { message: "Missing Authorization Bearer Token!" });
    }
    const token = header.slice("Bearer ".length);
    try {
        const payload = verifyAccessToken(token);
        req.auth = { userId: payload.sub, role: payload.role };
        next();
    }
    catch (err) {
        throw new ApiError(401, { message: "Invalid Authorization Bearer Token!" });
    }
}
export function requireRole(role) {
    return (req, res, next) => {
        const user = req.auth;
        if (!user) {
            throw new ApiError(401, { message: "Unauthorized" });
        }
        if (user.role !== role) {
            throw new ApiError(403, { message: "Forbidden" });
        }
        next();
    };
}
//# sourceMappingURL=auth.middleware.js.map