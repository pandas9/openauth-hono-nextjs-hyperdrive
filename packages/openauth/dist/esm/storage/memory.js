// src/storage/memory.ts
import {joinKey, splitKey} from "./storage.js";
import {existsSync, readFileSync} from "fs";
import {writeFile} from "fs/promises";
function MemoryStorage(input) {
  const store = [];
  if (input?.persist) {
    if (existsSync(input.persist)) {
      const file = readFileSync(input?.persist);
      store.push(...JSON.parse(file.toString()));
    }
  }
  async function save() {
    if (!input?.persist)
      return;
    const file = JSON.stringify(store);
    await writeFile(input.persist, file);
  }
  function search(key) {
    let left = 0;
    let right = store.length - 1;
    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      const comparison = key.localeCompare(store[mid][0]);
      if (comparison === 0) {
        return { found: true, index: mid };
      } else if (comparison < 0) {
        right = mid - 1;
      } else {
        left = mid + 1;
      }
    }
    return { found: false, index: left };
  }
  return {
    async get(key) {
      const match = search(joinKey(key));
      if (!match.found)
        return;
      const entry = store[match.index][1];
      if (entry.expiry && Date.now() >= entry.expiry) {
        store.splice(match.index, 1);
        await save();
        return;
      }
      return entry.value;
    },
    async set(key, value, expiry) {
      const joined = joinKey(key);
      const match = search(joined);
      const entry = [
        joined,
        {
          value,
          expiry: expiry ? expiry.getTime() : expiry
        }
      ];
      if (!match.found) {
        store.splice(match.index, 0, entry);
      } else {
        store[match.index] = entry;
      }
      await save();
    },
    async remove(key) {
      const joined = joinKey(key);
      const match = search(joined);
      if (match.found) {
        store.splice(match.index, 1);
        await save();
      }
    },
    async* scan(prefix) {
      const now = Date.now();
      const prefixStr = joinKey(prefix);
      for (const [key, entry] of store) {
        if (!key.startsWith(prefixStr))
          continue;
        if (entry.expiry && now >= entry.expiry)
          continue;
        yield [splitKey(key), entry.value];
      }
    }
  };
}
export {
  MemoryStorage
};
