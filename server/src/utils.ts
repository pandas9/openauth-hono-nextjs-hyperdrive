import { createClient } from "@openauthjs/openauth/client";
import { Context } from "hono";

let cachedClient: ReturnType<typeof createClient> | null = null;

export function getClient(issuer: string) {
  if (cachedClient) {
    return cachedClient;
  }

  cachedClient = createClient({
    clientID: "server",
    issuer,
  });

  return cachedClient;
}

export function formatValidationErrors(result: any, c: Context) {
  if (!result.success) {
    const errors = result.error.errors.map((err: any) => err.message);
    return c.json({ errors }, 400);
  }
}
