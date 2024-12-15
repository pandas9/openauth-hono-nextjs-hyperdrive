// src/adapter/apple.ts
import {Oauth2Adapter} from "./oauth2.js";
import {OidcAdapter} from "./oidc.js";
function AppleAdapter(config) {
  return Oauth2Adapter({
    ...config,
    type: "apple",
    endpoint: {
      authorization: "https://appleid.apple.com/auth/authorize",
      token: "https://appleid.apple.com/auth/token"
    }
  });
}
function AppleOidcAdapter(config) {
  return OidcAdapter({
    ...config,
    type: "apple",
    issuer: "https://appleid.apple.com"
  });
}
export {
  AppleOidcAdapter,
  AppleAdapter
};
