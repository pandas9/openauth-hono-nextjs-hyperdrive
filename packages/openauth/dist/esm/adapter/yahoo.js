// src/adapter/yahoo.ts
import {Oauth2Adapter} from "./oauth2.js";
function YahooAdapter(config) {
  return Oauth2Adapter({
    ...config,
    type: "yahoo",
    endpoint: {
      authorization: "https://api.login.yahoo.com/oauth2/request_auth",
      token: "https://api.login.yahoo.com/oauth2/get_token"
    }
  });
}
export {
  YahooAdapter
};
