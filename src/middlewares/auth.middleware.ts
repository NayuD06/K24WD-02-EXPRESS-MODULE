import type { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/http.js";
import { verifyAccessToken } from "../utils/jwt.js";

export type AuthUser = {
  userId: string;
  role: "customer" | "admin";
};

declare global {
  namespace Express {
    interface Request {
      auth?: AuthUser;
    }
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    throw new ApiError(401, { message: "Missing Authorization Bearer Token!" });
  }

  const token = header.slice("Bearer ".length);
  try {
    const payload = verifyAccessToken(token);
    req.auth = { userId: payload.sub, role: payload.role };
    next();
  } catch (err) {
    throw new ApiError(401, { message: "Invalid Authorization Bearer Token!" });
  }

}
export function requireRole(role: "customer" | "admin") {
  return (req: Request, res: Response, next: NextFunction) => {
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
