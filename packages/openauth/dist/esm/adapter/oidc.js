// src/adapter/oidc.ts
import {createLocalJWKSet, jwtVerify} from "jose";
import {OauthError} from "../error.js";
import {getRelativeUrl} from "../util.js";
function OidcAdapter(config) {
  const query = config.query || {};
  const scopes = config.scopes || [];
  const wk = fetch(config.issuer + "/.well-known/openid-configuration").then(async (r) => {
    if (!r.ok)
      throw new Error(await r.text());
    return r.json();
  });
  const jwks = wk.then((r) => r.jwks_uri).then(async (uri) => {
    const r = await fetch(uri);
    if (!r.ok)
      throw new Error(await r.text());
    return createLocalJWKSet(await r.json());
  });
  return {
    type: config.type || "oidc",
    init(routes, ctx) {
      routes.get("/authorize", async (c) => {
        const adapter = {
          state: crypto.randomUUID(),
          nonce: crypto.randomUUID(),
          redirect: getRelativeUrl(c, "./callback")
        };
        await ctx.set(c, "adapter", 600, adapter);
        const authorization = new URL(await wk.then((r) => r.authorization_endpoint));
        authorization.searchParams.set("client_id", config.clientID);
        authorization.searchParams.set("response_type", "id_token");
        authorization.searchParams.set("response_mode", "form_post");
        authorization.searchParams.set("state", adapter.state);
        authorization.searchParams.set("nonce", adapter.nonce);
        authorization.searchParams.set("redirect_uri", adapter.redirect);
        authorization.searchParams.set("scope", ["openid", ...scopes].join(" "));
        for (const [key, value] of Object.entries(query)) {
          authorization.searchParams.set(key, value);
        }
        return c.redirect(authorization.toString());
      });
      routes.post("/callback", async (c) => {
        const adapter = await ctx.get(c, "adapter");
        if (!adapter)
          return c.redirect(getRelativeUrl(c, "./authorize"));
        const body = await c.req.formData();
        const error2 = body.get("error");
        if (error2)
          throw new OauthError(error2.toString(), body.get("error_description")?.toString() || "");
        const idToken = body.get("id_token");
        if (!idToken)
          throw new OauthError("invalid_request", "Missing id_token");
        const result = await jwtVerify(idToken.toString(), await jwks, {
          audience: config.clientID
        });
        if (result.payload.nonce !== adapter.nonce) {
          throw new OauthError("invalid_request", "Invalid nonce");
        }
        return ctx.success(c, {
          id: result.payload,
          clientID: config.clientID
        });
      });
    }
  };
}
export {
  OidcAdapter
};
