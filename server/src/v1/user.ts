import { Hono } from "hono";
import { Bindings, userSchema, Variables } from "../validator";
import { zValidator } from "@hono/zod-validator";
import { formatValidationErrors } from "../utils";

const app = new Hono<{
  Variables: Variables;
  Bindings: Bindings;
}>()
  .get("/", (c) => c.json({ message: "get user", user: c.get("user") }))
  .post("/", zValidator("json", userSchema, formatValidationErrors), (c) => {
    const data = c.req.valid("json");
    return c.json({ message: "create user", data }, 201);
  })
  .get("/:id", (c) => c.json({ message: `get ${c.req.param("id")}` }));

export default app;
