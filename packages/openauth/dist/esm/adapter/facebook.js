// src/adapter/facebook.ts
import {Oauth2Adapter} from "./oauth2.js";
import {OidcAdapter} from "./oidc.js";
function FacebookAdapter(config) {
  return Oauth2Adapter({
    ...config,
    type: "facebook",
    endpoint: {
      authorization: "https://www.facebook.com/v12.0/dialog/oauth",
      token: "https://graph.facebook.com/v12.0/oauth/access_token"
    }
  });
}
function FacebookOidcAdapter(config) {
  return OidcAdapter({
    ...config,
    type: "facebook",
    issuer: "https://graph.facebook.com"
  });
}
export {
  FacebookOidcAdapter,
  FacebookAdapter
};
