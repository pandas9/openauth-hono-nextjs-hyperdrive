import { Hono } from "hono";
import { openAuth } from "./middleware";
import { Bindings, Variables } from "./validator";
import { cors } from "hono/cors";
import { env } from "hono/adapter";
import { API_PUBLIC_PREFIX, API_V1_PREFIX } from "./helper";
import user from "./v1/user";
import { logger } from "hono/logger";

const app = new Hono<{
  Variables: Variables;
  Bindings: Bindings;
}>();

app.use(logger());

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

app.use("/api/*", openAuth);

app.route(`${API_V1_PREFIX}/user`, user);

app.get(`${API_PUBLIC_PREFIX}/hello`, (c) => {
  return c.json({ message: "world!" });
});

app.notFound((c) => {
  return c.json({ message: "Not Found" }, 404);
});

app.onError((err, c) => {
  console.error(`${err}`);
  return c.json({ message: "Internal Server Error" }, 500);
});

export default app;
