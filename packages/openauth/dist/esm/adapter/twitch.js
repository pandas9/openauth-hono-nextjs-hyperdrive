// src/adapter/twitch.ts
import {Oauth2Adapter} from "./oauth2.js";
function TwitchAdapter(config) {
  return Oauth2Adapter({
    type: "twitch",
    ...config,
    endpoint: {
      authorization: "https://id.twitch.tv/oauth2/authorize",
      token: "https://id.twitch.tv/oauth2/token"
    }
  });
}
export {
  TwitchAdapter
};
