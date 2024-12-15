// src/adapter/jumpcloud.ts
import {Oauth2Adapter} from "./oauth2.js";
function JumpCloudAdapter(config) {
  return Oauth2Adapter({
    type: "jumpcloud",
    ...config,
    endpoint: {
      authorization: "https://oauth.id.jumpcloud.com/oauth2/auth",
      token: "https://oauth.id.jumpcloud.com/oauth2/token"
    }
  });
}
export {
  JumpCloudAdapter
};
