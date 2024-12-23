// src/storage/cloudflare.ts
import {joinKey, splitKey} from "./storage.js";
function CloudflareStorage(options) {
  return {
    async get(key) {
      const value = await options.namespace.get(joinKey(key), "json");
      if (!value)
        return;
      return value;
    },
    async set(key, value, expiry) {
      await options.namespace.put(joinKey(key), JSON.stringify(value), {
        expirationTtl: expiry ? Math.floor((expiry.getTime() - Date.now()) / 1000) : undefined
      });
    },
    async remove(key) {
      await options.namespace.delete(joinKey(key));
    },
    async* scan(prefix) {
      let cursor;
      while (true) {
        const result = await options.namespace.list({
          prefix: joinKey([...prefix, ""]),
          cursor
        });
        for (const key of result.keys) {
          const value = await options.namespace.get(key.name, "json");
          if (value !== null) {
            yield [splitKey(key.name), value];
          }
        }
        if (result.list_complete) {
          break;
        }
        cursor = result.cursor;
      }
    }
  };
}
export {
  CloudflareStorage
};
