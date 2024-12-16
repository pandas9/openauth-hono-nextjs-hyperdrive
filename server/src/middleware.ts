import { Next, Context } from "hono";
import { getCookie, setCookie } from "hono/cookie";
import { customLogger, getAuthClient, getKeyValue, setKeyValue } from "./utils";
import { subjects } from "@openauthjs/openauth/subjects";
import { RateLimitConfig } from "./validator";

export const openAuth = async (c: Context, next: Next) => {
  const accessToken = getCookie(c, "access_token");
  const refreshToken = getCookie(c, "refresh_token");

  if (!accessToken || !refreshToken) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  try {
    const client = getAuthClient(c.env.AUTH_URL);

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

    c.set("user", verified.subject.properties);

    await next();
  } catch (error) {
    return c.json({ error: "Unauthorized" }, 401);
  }
};

export const rateLimiter = (config: RateLimitConfig) => {
  return async (c: Context, next: Next) => {
    const ip = c.req.header("x-forwarded-for") || "unknown";

    if (!c.req.path.startsWith(config.routePrefix)) {
      throw new Error("Req path doesnt match route prefix");
    }
    // Use provided route prefix or fall back to full path
    const key = `ratelimit:${ip}:${
      config.routePrefixBasedLimit ? config.routePrefix : c.req.path
    }`;

    /*
    // if user is premium, then increase the limit
    // this is just an example, you can do anything here
    // you can also check c.req.path or config.routePrefix
    const user = c.get("user");
    if (user && user.tier === "premium") {
      config.max = 1000;
    }
    */

    const now = Date.now();

    // Get existing record
    const record = await getKeyValue(key);
    const currentRecord = record
      ? JSON.parse(record)
      : {
          count: 0,
          resetTime: now + config.windowMs,
        };

    // Reset if window has expired
    if (now > currentRecord.resetTime) {
      currentRecord.count = 0;
      currentRecord.resetTime = now + config.windowMs;
    }

    // Increment count
    currentRecord.count += 1;

    // Store updated record
    await setKeyValue(key, JSON.stringify(currentRecord));

    // Check if over limit
    if (currentRecord.count > config.max) {
      const retryAfterSeconds = Math.ceil(
        (currentRecord.resetTime - now) / 1000
      );
      const retryAfterMinutes = Math.ceil(retryAfterSeconds / 60);
      return c.json(
        {
          error: `Too many requests. Please try again in ${retryAfterMinutes} minute${
            retryAfterMinutes === 1 ? "" : "s"
          }`,
          retryAfter: retryAfterSeconds,
        },
        429
      );
    }

    // Add rate limit info to headers
    c.header("X-RateLimit-Limit", config.max.toString());
    c.header(
      "X-RateLimit-Remaining",
      (config.max - currentRecord.count).toString()
    );
    c.header(
      "X-RateLimit-Reset",
      Math.ceil(currentRecord.resetTime / 1000).toString()
    );

    await next();
  };
};
