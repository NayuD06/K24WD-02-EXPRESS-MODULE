import { ok } from "../../utils/http.js";
import { env } from "../../config/env.js";
function setCookie(res, token) {
    res.cookie(env.refreshCookieName, token, {
        httpOnly: true,
        sameSite: "lax",
        secure: env.nodeEnv === "production",
        maxAge: env.accessTokenTltSeconds * 1000,
        path: "/api/auth",
    });
}
export class AuthController {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    login = async (_req, res) => {
        const { email, password } = _req.body ?? {};
        // const userAgent = _req.headers["user-agent"];
        // const userIp = _req.ip;
        const input = {
            email,
            password,
        };
        const { accessToken, refreshToken } = await this.authService.login(input);
        setCookie(res, refreshToken);
        res.json(ok({ accessToken, refreshToken }));
    };
}
//# sourceMappingURL=auth.controller.js.map