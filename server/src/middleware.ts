import { Next, Context } from "hono";
import { getCookie, setCookie } from "hono/cookie";
import { env } from "hono/adapter";
import { getClient } from "./utils";
import { subjects } from "@openauthjs/openauth/subjects";

export const openAuth = async (c: Context, next: Next) => {
  const accessToken = getCookie(c, "access_token");
  const refreshToken = getCookie(c, "refresh_token");

  if (!accessToken || !refreshToken) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  try {
    const { AUTH_URL } = env(c);

    const client = getClient(AUTH_URL);

    const verified = await client.verify(subjects, accessToken, {
      refresh: refreshToken,
    });

    if (verified.err) {
      return c.json({ error: "Unauthorized" }, 401);
    }
    if (verified.tokens) {
      setCookie(c, "access_token", verified.tokens.access);
      setCookie(c, "refresh_token", verified.tokens.refresh);
    }

    c.set("user", verified.subject);

    await next();
  } catch (error) {
    return c.json({ error: "Unauthorized" }, 401);
  }
};
