import { Hono } from "hono";
import { Env } from "../../validator";
import { rateLimiter } from "../../middleware";
import ms from "ms";

const app = new Hono<Env>()
  .use(
    rateLimiter({
      windowMs: ms("1 minute"),
      max: 10,
    })
  )
  .get("/health", (c) => c.json({ message: "all good here" }));

export default app;
