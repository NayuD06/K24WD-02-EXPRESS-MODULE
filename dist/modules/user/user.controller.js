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
    // PUT 
    replace = async (req, res) => {
        const id = req.params.id;
        const { email, password, role } = req.body;
        if (!email || !password || !role) {
            res.status(400).json({ message: "PUT requires email, password and role" });
            return;
        }
        const user = await this.userService.replace(id, { email, password, role });
        res.json(ok({
            id: user?._id.toString(),
            email: user?.email,
            role: user?.role,
            updatedAt: user?.updatedAt,
        }));
    };
    // PATCH
    update = async (req, res) => {
        const id = req.params.id;
        const { email, password, role } = req.body;
        const user = await this.userService.update(id, { email, password, role });
        res.json(ok({
            id: user?._id.toString(),
            email: user?.email,
            role: user?.role,
            updatedAt: user?.updatedAt,
        }));
    };
    // DELETE
    delete = async (req, res) => {
        const id = req.params.id;
        await this.userService.delete(id);
        res.status(204).end();
    };
}
//# sourceMappingURL=user.controller.js.map