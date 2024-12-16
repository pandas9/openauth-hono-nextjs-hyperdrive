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
import { every, some } from "hono/combine";

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

// rate limit for all routes
// if route prefix is not matched, then rate limiter will throw an error
// that is handled by every function
app.use(
  "*",
  some(
    // rate limit for private routes
    every(
      rateLimiter({
        windowMs: 1 * 60 * 1000, // 1 minute
        max: 10,
        routePrefix: API_V1_PREFIX, // every route has a limit of 10 requests per minute but not request method
      })
    ),
    // rate limit for file routes
    every(
      rateLimiter({
        windowMs: 1 * 60 * 1000,
        max: 10,
        routePrefix: `${API_V1_PUBLIC_PREFIX}/file`,
        routePrefixBasedLimit: true,
      })
    ),
    // every other public route
    every(
      rateLimiter({
        windowMs: 1 * 60 * 1000,
        max: 2,
        routePrefix: API_V1_PUBLIC_PREFIX,
      })
    ),
    // every other route
    every(
      rateLimiter({
        windowMs: 1 * 60 * 1000,
        max: 100,
        routePrefix: "/",
      })
    )
  )
);

export const routes = app
  .route(`${API_V1_PREFIX}/user`, userRoutes)
  .route(`${API_V1_PREFIX}/upload`, uploadRoutes)
  .route(API_V1_PUBLIC_PREFIX, publicRoutes);

app.notFound((c) => {
  return c.json({ message: "Not Found" }, 404);
});

app.onError((err, c) => {
  console.error(`${err}`);
  return c.json({ message: "Internal Server Error" }, 500);
});

export default app;
