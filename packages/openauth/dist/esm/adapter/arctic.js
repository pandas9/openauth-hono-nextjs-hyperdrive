// src/adapter/arctic.ts
import {OauthError} from "../error.js";
function ArcticAdapter(adapter, config) {
  function getClient(c) {
    const callback = new URL(c.req.url);
    callback.pathname = callback.pathname.replace(/authorize.*$/, "callback");
    callback.search = "";
    callback.host = c.req.header("x-forwarded-host") || callback.host;
    return new adapter(config.clientID, config.clientSecret, callback.toString());
  }
  return {
    type: "arctic",
    init(routes, ctx) {
      routes.get("/authorize", async (c) => {
        const client = getClient(c);
        const state = crypto.randomUUID();
        await ctx.set(c, "adapter", 600, {
          state
        });
        return c.redirect(client.createAuthorizationURL(state, config.scopes));
      });
      routes.get("/callback", async (c) => {
        const client = getClient(c);
        const adapter2 = await ctx.get(c, "adapter");
        if (!adapter2)
          return c.redirect("../authorize");
        const code = c.req.query("code");
        const state = c.req.query("state");
        if (!code)
          throw new Error("Missing code");
        if (state !== adapter2.state)
          throw new OauthError("invalid_request", "Invalid state");
        const tokens = await client.validateAuthorizationCode(code);
        return ctx.success(c, {
          tokenset: tokens
        });
      });
    }
  };
}
export {
  ArcticAdapter
};
