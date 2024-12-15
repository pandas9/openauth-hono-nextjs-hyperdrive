// src/storage/storage.ts
function joinKey(key) {
  return key.join(SEPERATOR);
}
function splitKey(key) {
  return key.split(SEPERATOR);
}
var SEPERATOR = String.fromCharCode(31);
var Storage;
(function(Storage) {
  function encode(key) {
    return key.map((k) => k.replaceAll(SEPERATOR, ""));
  }
  function get(adapter, key) {
    return adapter.get(encode(key));
  }
  Storage.get = get;
  function set(adapter, key, value, ttl) {
    const expiry = ttl ? new Date(Date.now() + ttl * 1000) : undefined;
    return adapter.set(encode(key), value, expiry);
  }
  Storage.set = set;
  function remove(adapter, key) {
    return adapter.remove(encode(key));
  }
  Storage.remove = remove;
  function scan(adapter, key) {
    return adapter.scan(encode(key));
  }
  Storage.scan = scan;
})(Storage || (Storage = {}));
export {
  splitKey,
  joinKey,
  Storage
};
