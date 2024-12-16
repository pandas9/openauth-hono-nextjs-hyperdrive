import { Hono } from "hono";
import { openAuth } from "./middleware";
import { Variables } from "./utils";
import { cors } from "hono/cors";

const app = new Hono<{ Variables: Variables }>();

app.use(
  "*",
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);

app.use("/api/*", openAuth);

app.get("/api/hello", (c) => {
  const user = c.get("user");
  console.log(user);
  return c.json({ message: "world!" });
});

app.get("/public/api/hello", (c) => {
  return c.json({ message: "world!" });
});

export default app;
