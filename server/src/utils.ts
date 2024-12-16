import { createClient } from "@openauthjs/openauth/client";
import { Context } from "hono";
import { getContext } from "hono/context-storage";
import { Env } from "./validator";

let cachedClient: ReturnType<typeof createClient> | null = null;

export function getAuthClient(issuer: string) {
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

export const setKeyValue = (key: string, value: string) => {
  return getContext<Env>().env.KV.put(key, value);
};

export const getKeyValue = (key: string) => {
  return getContext<Env>().env.KV.get(key);
};

export const customLogger = (message: string, ...rest: string[]) => {
  console.log(message, ...rest);
};
