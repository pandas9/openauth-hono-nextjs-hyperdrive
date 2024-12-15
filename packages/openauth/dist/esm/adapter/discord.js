// src/adapter/discord.ts
import {Oauth2Adapter} from "./oauth2.js";
function DiscordAdapter(config) {
  return Oauth2Adapter({
    type: "discord",
    ...config,
    endpoint: {
      authorization: "https://discord.com/oauth2/authorize",
      token: "https://discord.com/api/oauth2/token"
    }
  });
}
export {
  DiscordAdapter
};
