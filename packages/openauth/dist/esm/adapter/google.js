// src/adapter/google.ts
import {Oauth2Adapter} from "./oauth2.js";
import {OidcAdapter} from "./oidc.js";
function GoogleAdapter(config) {
  return Oauth2Adapter({
    ...config,
    type: "google",
    endpoint: {
      authorization: "https://accounts.google.com/o/oauth2/v2/auth",
      token: "https://oauth2.googleapis.com/token"
    }
  });
}
function GoogleOidcAdapter(config) {
  return OidcAdapter({
    ...config,
    type: "google",
    issuer: "https://accounts.google.com"
  });
}
export {
  GoogleOidcAdapter,
  GoogleAdapter
};
