import { Hono } from "hono";
import { Env } from "../../validator";
import system from "./system";
import files from "./files";

// if you want route to be /
// then rate limiter has to be applied per route
// app.get(
//   "/health",
//   rateLimiter({
//     windowMs: ms("1 minute"),
//     max: 10,
//   }),
//   (c) => c.json({ message: "all good here" })
// );
const publicRoutes = new Hono<Env>()
  .route("/system", system)
  .route("/files", files);

export default publicRoutes;
