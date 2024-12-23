import { Hono } from "hono";
import { openAuth, rateLimiter } from "./middleware";
import { cors } from "hono/cors";
import { env } from "hono/adapter";
import { API_V1_PUBLIC_PREFIX, API_V1_PREFIX } from "./helper";
import userRoutes from "./v1/user";
import publicRoutes from "./v1/public";
import uploadRoutes from "./v1/upload";
import { logger } from "hono/logger";
import { Env } from "./validator";
import { contextStorage } from "hono/context-storage";
import { customLogger } from "./utils";
import ms from "ms";

const app = new Hono<Env>();

app.use(logger(customLogger));

app.use(contextStorage());

app.use("*", async (c, next) => {
  const { AUTH_URL } = env(c);
  const corsMiddlewareHandler = cors({
    origin: AUTH_URL.startsWith("http://")
      ? ["http://localhost:3000"]
      : ["https://example.com"],
    credentials: true,
  });
  return corsMiddlewareHandler(c, next);
});

// protected routes
app.use(`${API_V1_PREFIX}/*`, openAuth);

export const routes = app
  .route(`${API_V1_PREFIX}/user`, userRoutes)
  .route(`${API_V1_PREFIX}/upload`, uploadRoutes)
  .route(API_V1_PUBLIC_PREFIX, publicRoutes);

app
  .notFound((c) => {
    return c.json({ message: "Not Found" }, 404);
  })
  .use(
    rateLimiter({
      windowMs: ms("1 minute"),
      max: 2,
    })
  );

app.onError((err, c) => {
  console.error(`${err}`);
  return c.json({ message: "Internal Server Error" }, 500);
});

export default app;
