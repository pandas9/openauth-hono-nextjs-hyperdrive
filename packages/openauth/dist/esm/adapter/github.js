// src/adapter/github.ts
import {Oauth2Adapter} from "./oauth2.js";
function GithubAdapter(config) {
  return Oauth2Adapter({
    ...config,
    type: "github",
    endpoint: {
      authorization: "https://github.com/login/oauth/authorize",
      token: "https://github.com/login/oauth/access_token"
    }
  });
}
export {
  GithubAdapter
};
