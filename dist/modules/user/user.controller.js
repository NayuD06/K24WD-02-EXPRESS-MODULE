import { ok } from "../../utils/http.js";
export class UserController {
    userService;
    constructor(userService) {
        this.userService = userService;
    }
    list = async (_req, res) => {
        const users = await this.userService.list();
        res.json({ data: users });
    };
    // POST register
    register = async (_req, res) => {
        const { email, password, role } = _req.body;
        const user = await this.userService.register({ email, password, role });
        res.status(201).json(ok({
            id: user?._id.toString(),
            email: user?.email,
            role: user?.role,
            createdAt: user?.createdAt,
        }));
    };
}
//# sourceMappingURL=user.controller.js.map