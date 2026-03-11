import cookieParser from "cookie-parser";
import express from "express";
import { userRoutes } from "./modules/user/user.routes.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import { authRoutes } from "./modules/auth/auth.routes.js";
import { productRoutes } from "./modules/product/product.routes.js";

export function createApp() {
  const app = express();

  app.use(express.json());
  app.use(cookieParser());

  app.use("/api/users", userRoutes);
  app.use("/api/auth", authRoutes);
  app.use("/api/products", productRoutes);
  app.use(errorMiddleware);

  return app;
}