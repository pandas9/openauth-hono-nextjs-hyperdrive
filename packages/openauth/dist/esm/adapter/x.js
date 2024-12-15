// src/adapter/x.ts
import {Oauth2Adapter} from "./oauth2.js";
function XAdapter(config) {
  return Oauth2Adapter({
    ...config,
    type: "x",
    endpoint: {
      authorization: "https://twitter.com/i/oauth2/authorize",
      token: "https://api.x.com/2/oauth2/token"
    }
  });
}
export {
  XAdapter
};
