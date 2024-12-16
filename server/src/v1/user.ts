import { Hono } from "hono";
import { Bindings, Variables } from "../utils";

const app = new Hono<{
  Variables: Variables;
  Bindings: Bindings;
}>()
  .get("/", (c) => c.json({ message: "get user", user: c.get("user") }))
  .post("/", (c) => c.json({ message: "create user" }, 201))
  .get("/:id", (c) => c.json({ message: `get ${c.req.param("id")}` }));

export default app;
