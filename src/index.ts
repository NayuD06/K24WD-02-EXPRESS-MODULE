import { createApp } from "./app.js";
import { env } from "./config/env.js";
import { ensureIndexes } from "./database/indexes.js";
import { connectMongo } from "./database/mongo.js";

async function bootstrap() {
  await connectMongo();
  await ensureIndexes();

  const app = createApp();

  app.listen(env.port, () => {
    console.log(`[Server] listening on port http://localhost:${env.port}`);
  });
}

bootstrap().catch((error) => {
  console.error("Connection failed", error);
  process.exit(1);
});
