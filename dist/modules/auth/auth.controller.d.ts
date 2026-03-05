import type { Request, Response } from "express";
import type { AuthService } from "./auth.service.js";
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login: (_req: Request, res: Response) => Promise<void>;
}
//# sourceMappingURL=auth.controller.d.ts.map