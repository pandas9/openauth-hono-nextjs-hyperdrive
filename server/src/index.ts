import { Hono } from "hono";
import { openAuth, rateLimiter } from "./middleware";
import { cors } from "hono/cors";
import { env } from "hono/adapter";
import { API_V1_PUBLIC_PREFIX, API_V1_PREFIX } from "./helper";
import userRoutes from "./v1/user";
import publicRoutes from "./v1/public";
import { logger } from "hono/logger";
import { Env } from "./validator";
import { contextStorage } from "hono/context-storage";
import { customLogger } from "./utils";
import { every } from "hono/combine";

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

app.use(
  `${API_V1_PUBLIC_PREFIX}/*`,
  rateLimiter({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 2, // limit each IP to 100 requests per windowMs
  })
);

// this can also be specific to routes
// /user/*
// ...
app.use(
  `${API_V1_PREFIX}/*`,
  every(
    openAuth,
    rateLimiter({
      windowMs: 1 * 60 * 1000,
      max: 10, // higher limit for authenticated users
    })
  )
);

export const routes = app
  .route(`${API_V1_PREFIX}/user`, userRoutes)
  .route(API_V1_PUBLIC_PREFIX, publicRoutes);

app.notFound((c) => {
  return c.json({ message: "Not Found" }, 404);
});

app.onError((err, c) => {
  console.error(`${err}`);
  return c.json({ message: "Internal Server Error" }, 500);
});

export default app;
