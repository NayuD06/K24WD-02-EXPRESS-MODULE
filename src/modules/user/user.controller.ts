import type { Request, Response } from "express";
import type { UserService } from "./user.service.js";
import { ok } from "../../utils/http.js";

export class UserController {
  constructor(private readonly userService: UserService) {}

  list = async (_req: Request, res: Response) => {
    const users = await this.userService.list();
    res.json({ data: users });
  };

  // POST register
  register = async (_req: Request, res: Response) => {
    const { email, password, role } = _req.body;
    const user = await this.userService.register({ email, password, role });
    res.status(201).json(
      ok({
        id: user?._id.toString(),
        email: user?.email,
        role: user?.role,
        createdAt: user?.createdAt,
      }),
    );
  };
  // PUT 
  replace = async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
      res.status(400).json({ message: "PUT requires email, password and role" });
      return;
    }
    const user = await this.userService.replace(id, { email, password, role });
    res.json(
      ok({
        id: user?._id.toString(),
        email: user?.email,
        role: user?.role,
        updatedAt: user?.updatedAt,
      }),
    );
  };

  // PATCH
  update = async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const { email, password, role } = req.body;
    const user = await this.userService.update(id, { email, password, role });
    res.json(
      ok({
        id: user?._id.toString(),
        email: user?.email,
        role: user?.role,
        updatedAt: user?.updatedAt,
      }),
    );
  };

  // DELETE
  delete = async (req: Request, res: Response) => {
    const id = req.params.id as string;
    await this.userService.delete(id);
    res.status(204).end();
  };
}