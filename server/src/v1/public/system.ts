import { Hono } from "hono";
import { Env } from "../../validator";

const app = new Hono<Env>().get("/health", (c) =>
  c.json({ message: "all good here" })
);

export default app;
