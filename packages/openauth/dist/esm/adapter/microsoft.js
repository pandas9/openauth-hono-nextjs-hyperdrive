// src/adapter/microsoft.ts
import {Oauth2Adapter} from "./oauth2.js";
import {OidcAdapter} from "./oidc.js";
function MicrosoftAdapter(config) {
  return Oauth2Adapter({
    ...config,
    type: "microsoft",
    endpoint: {
      authorization: `https://login.microsoftonline.com/${config?.tenant}/oauth2/v2.0/authorize`,
      token: `https://login.microsoftonline.com/${config?.tenant}/oauth2/v2.0/token`
    }
  });
}
function MicrosoftOidcAdapter(config) {
  return OidcAdapter({
    ...config,
    type: "microsoft",
    issuer: "https://graph.microsoft.com/oidc/userinfo"
  });
}
export {
  MicrosoftOidcAdapter,
  MicrosoftAdapter
};
