// src/adapter/oauth2.ts
import {OauthError} from "../error.js";
import {getRelativeUrl} from "../util.js";
function Oauth2Adapter(config) {
  const query = config.query || {};
  return {
    type: config.type || "oauth2",
    init(routes, ctx) {
      routes.get("/authorize", async (c) => {
        const state = crypto.randomUUID();
        await ctx.set(c, "adapter", 600, {
          state,
          redirect: getRelativeUrl(c, "./callback")
        });
        const authorization = new URL(config.endpoint.authorization);
        authorization.searchParams.set("client_id", config.clientID);
        authorization.searchParams.set("redirect_uri", getRelativeUrl(c, "./callback"));
        authorization.searchParams.set("response_type", "code");
        authorization.searchParams.set("state", state);
        authorization.searchParams.set("scope", config.scopes.join(" "));
        for (const [key, value] of Object.entries(query)) {
          authorization.searchParams.set(key, value);
        }
        return c.redirect(authorization.toString());
      });
      routes.get("/callback", async (c) => {
        const adapter = await ctx.get(c, "adapter");
        const code = c.req.query("code");
        const state = c.req.query("state");
        const error2 = c.req.query("error");
        if (error2)
          throw new OauthError(error2.toString(), c.req.query("error_description")?.toString() || "");
        if (!adapter || !code || adapter.state && state !== adapter.state)
          return c.redirect(getRelativeUrl(c, "./authorize"));
        const body = new URLSearchParams({
          client_id: config.clientID,
          client_secret: config.clientSecret,
          code,
          grant_type: "authorization_code",
          redirect_uri: adapter.redirect
        });
        const json = await fetch(config.endpoint.token, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Accept: "application/json"
          },
          body: body.toString()
        }).then((r) => r.json());
        if ("error" in json)
          throw new OauthError(json.error, json.error_description);
        return ctx.success(c, {
          clientID: config.clientID,
          tokenset: {
            get access() {
              return json.access_token;
            },
            get refresh() {
              return json.refresh_token;
            },
            get expiry() {
              return json.expires_in;
            },
            get raw() {
              return json;
            }
          }
        });
      });
    }
  };
}
export {
  Oauth2Adapter
};
