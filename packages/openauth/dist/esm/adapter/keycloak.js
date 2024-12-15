// src/adapter/keycloak.ts
import {Oauth2Adapter} from "./oauth2.js";
function KeycloakAdapter(config) {
  const baseConfig = {
    ...config,
    endpoint: {
      authorization: `${config.baseUrl}/realms/${config.realm}/protocol/openid-connect/auth`,
      token: `${config.baseUrl}/realms/${config.realm}/protocol/openid-connect/token`
    }
  };
  return Oauth2Adapter(baseConfig);
}
export {
  KeycloakAdapter
};
