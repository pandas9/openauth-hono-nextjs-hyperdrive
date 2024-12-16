import { Hono } from "hono";
import { userSchema, Env } from "../validator";
import { zValidator } from "@hono/zod-validator";
import {
  formatValidationErrors,
  setKeyValue,
  getKeyValue,
  customLogger,
} from "../utils";

const app = new Hono<Env>()
  .get("/", (c) => c.json({ message: "get user", user: c.get("user") }))
  .post("/", zValidator("json", userSchema, formatValidationErrors), (c) => {
    const data = c.req.valid("json");
    return c.json({ message: "create user", data }, 201);
  })
  .get("/set-kv", async (c) => {
    await setKeyValue("test", "value");
    return c.json({ message: "set kv" });
  })
  .get("/get-kv", async (c) => {
    const value = await getKeyValue("test");
    customLogger("hi");
    return c.json({ message: "hi kv", value });
  })
  // this has to be last otherwise it will be treated as a dynamic route
  .get("/:id", (c) => c.json({ message: `get ${c.req.param("id")}` }));

export default app;
