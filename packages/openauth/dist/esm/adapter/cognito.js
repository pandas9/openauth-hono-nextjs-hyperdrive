// src/adapter/cognito.ts
import {Oauth2Adapter} from "./oauth2.js";
function CognitoAdapter(config) {
  const domain = `${config.domain}.auth.${config.region}.amazoncognito.com`;
  return Oauth2Adapter({
    type: "cognito",
    ...config,
    endpoint: {
      authorization: `https://${domain}/oauth2/authorize`,
      token: `https://${domain}/oauth2/token`
    }
  });
}
export {
  CognitoAdapter
};
