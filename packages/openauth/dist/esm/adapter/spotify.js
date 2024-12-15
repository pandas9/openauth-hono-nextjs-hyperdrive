// src/adapter/spotify.ts
import {Oauth2Adapter} from "./oauth2.js";
function SpotifyAdapter(config) {
  return Oauth2Adapter({
    ...config,
    type: "spotify",
    endpoint: {
      authorization: "https://accounts.spotify.com/authorize",
      token: "https://accounts.spotify.com/api/token"
    }
  });
}
export {
  SpotifyAdapter
};
