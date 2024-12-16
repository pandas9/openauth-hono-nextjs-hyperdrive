import { Hono } from "hono";
import { Env } from "../validator";

const app = new Hono<Env>()
  // Upload file to R2
  .put("/file/:key", async (c) => {
    const key = c.req.param("key");
    const body = await c.req.raw.arrayBuffer();
    await c.env.BUCKET.put(key, body);
    return c.json({ message: `File ${key} uploaded successfully` }, 201);
  })

  // Delete file from R2
  .delete("/file/:key", async (c) => {
    const key = c.req.param("key");
    await c.env.BUCKET.delete(key);
    return c.json({ message: `File ${key} deleted successfully` });
  })

  // Handle multipart form data upload
  .post("/file", async (c) => {
    const body = await c.req.parseBody();
    const file = body["file"];

    if (file && file instanceof File) {
      const arrayBuffer = await file.arrayBuffer();
      await c.env.BUCKET.put(file.name, arrayBuffer);
      return c.json(
        { message: `File ${file.name} uploaded successfully` },
        201
      );
    }

    return c.json({ message: "No file provided" }, 400);
  });

export default app;
