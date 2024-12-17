import { Hono } from "hono";
import { Env } from "../../validator";
import ms from "ms";
import { rateLimiter } from "../../middleware";

const app = new Hono<Env>()
  .use(
    rateLimiter({
      windowMs: ms("1 minute"),
      max: 15,
    })
  )
  .get("/file/:key", async (c) => {
    const key = c.req.param("key");
    const object = await c.env.BUCKET.get(key);

    if (!object) {
      return c.json({ message: "File not found" }, 404);
    }

    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set("etag", object.httpEtag);

    return new Response(object.body, {
      headers,
    });
  });

export default app;
