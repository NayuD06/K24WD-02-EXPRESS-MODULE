import type { Request, Response } from "express";
import type { UserService } from "./user.service.js";
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    list: (_req: Request, res: Response) => Promise<void>;
    register: (_req: Request, res: Response) => Promise<void>;
}
//# sourceMappingURL=user.controller.d.ts.map