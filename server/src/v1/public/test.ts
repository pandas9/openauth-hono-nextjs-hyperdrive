import { Hono } from "hono";
import { Env } from "../../validator";

const app = new Hono<Env>().get("/hello", (c) => c.json({ message: "world!" }));

export default app;
