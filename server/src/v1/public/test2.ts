import { Hono } from "hono";
import { Env } from "../../validator";

const app = new Hono<Env>().get("/world", (c) => c.json({ message: "hello" }));

export default app;
