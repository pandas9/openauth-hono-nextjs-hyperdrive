// src/keys.ts
import {
exportJWK,
exportPKCS8,
exportSPKI,
generateKeyPair,
importPKCS8,
importSPKI
} from "jose";
import {Storage} from "./storage/storage.js";
async function keys(storage2) {
  const results = [];
  const scanner = Storage.scan(storage2, ["oauth:key"]);
  for await (const [_key, value] of scanner) {
    const publicKey = await importSPKI(value.publicKey, alg, {
      extractable: true
    });
    const privateKey = await importPKCS8(value.privateKey, alg);
    const jwk = await exportJWK(publicKey);
    jwk.kid = value.id;
    results.push({
      id: value.id,
      alg,
      created: new Date(value.created),
      signing: {
        public: publicKey,
        private: privateKey
      },
      encryption: {
        public: await importSPKI(value.publicKey, "RSA-OAEP-512"),
        private: await importPKCS8(value.privateKey, "RSA-OAEP-512")
      },
      jwk
    });
  }
  if (results.length)
    return results;
  const key = await generateKeyPair(alg, {
    extractable: true
  });
  const serialized = {
    id: crypto.randomUUID(),
    publicKey: await exportSPKI(key.publicKey),
    privateKey: await exportPKCS8(key.privateKey),
    created: Date.now()
  };
  await Storage.set(storage2, ["oauth:key", serialized.id], serialized);
  return keys(storage2);
}
var alg = "RS512";
export {
  keys
};
