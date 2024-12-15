// src/adapter/password.ts
import {UnknownStateError} from "../error.js";
import {Storage} from "../storage/storage.js";
function PasswordAdapter(config) {
  const hasher = config.hasher ?? ScryptHasher();
  function generate() {
    const buffer = crypto.getRandomValues(new Uint8Array(6));
    const otp = Array.from(buffer).map((byte) => byte % 10).join("");
    return otp;
  }
  return {
    type: "password",
    init(routes, ctx) {
      routes.get("/authorize", async (c) => ctx.forward(c, await config.login(c.req.raw)));
      routes.post("/authorize", async (c) => {
        const fd = await c.req.formData();
        async function error2(err) {
          return ctx.forward(c, await config.login(c.req.raw, fd, err));
        }
        const email = fd.get("email")?.toString()?.toLowerCase();
        if (!email)
          return error2({ type: "invalid_email" });
        const hash = await Storage.get(ctx.storage, [
          "email",
          email,
          "password"
        ]);
        const password = fd.get("password")?.toString();
        if (!password || !hash || !await hasher.verify(password, hash))
          return error2({ type: "invalid_password" });
        return ctx.success(c, {
          email
        }, {
          invalidate: async (subject) => {
            await Storage.set(ctx.storage, ["email", email, "subject"], subject);
          }
        });
      });
      routes.get("/register", async (c) => {
        const state = {
          type: "start"
        };
        await ctx.set(c, "adapter", 86400, state);
        return ctx.forward(c, await config.register(c.req.raw, state));
      });
      routes.post("/register", async (c) => {
        const fd = await c.req.formData();
        const email = fd.get("email")?.toString()?.toLowerCase();
        const action = fd.get("action")?.toString();
        const adapter = await ctx.get(c, "adapter");
        async function transition(next, err) {
          await ctx.set(c, "adapter", 86400, next);
          return ctx.forward(c, await config.register(c.req.raw, next, fd, err));
        }
        if (action === "register" && adapter.type === "start") {
          const password = fd.get("password")?.toString();
          const repeat = fd.get("repeat")?.toString();
          if (!email)
            return transition(adapter, { type: "invalid_email" });
          if (!password)
            return transition(adapter, { type: "invalid_password" });
          if (password !== repeat)
            return transition(adapter, { type: "password_mismatch" });
          const existing = await Storage.get(ctx.storage, [
            "email",
            email,
            "password"
          ]);
          if (existing)
            return transition(adapter, { type: "email_taken" });
          const code = generate();
          await config.sendCode(email, code);
          return transition({
            type: "code",
            code,
            password: await hasher.hash(password),
            email
          });
        }
        if (action === "verify" && adapter.type === "code") {
          const code = fd.get("code")?.toString();
          if (!code || code !== adapter.code)
            return transition(adapter, { type: "invalid_code" });
          const existing = await Storage.get(ctx.storage, [
            "email",
            adapter.email,
            "password"
          ]);
          if (existing)
            return transition({ type: "start" }, { type: "email_taken" });
          await Storage.set(ctx.storage, ["email", adapter.email, "password"], adapter.password);
          return ctx.success(c, {
            email: adapter.email
          });
        }
        return transition({ type: "start" });
      });
      routes.get("/change", async (c) => {
        const redirect = c.req.query("redirect_uri") || c.req.url.replace(/change.*/, "authorize");
        const state = {
          type: "start",
          redirect
        };
        await ctx.set(c, "adapter", 86400, state);
        return ctx.forward(c, await config.change(c.req.raw, state));
      });
      routes.post("/change", async (c) => {
        const fd = await c.req.formData();
        const action = fd.get("action")?.toString();
        const adapter = await ctx.get(c, "adapter");
        if (!adapter)
          throw new UnknownStateError;
        async function transition(next, err) {
          await ctx.set(c, "adapter", 86400, next);
          return ctx.forward(c, await config.change(c.req.raw, next, fd, err));
        }
        if (action === "code") {
          const email = fd.get("email")?.toString()?.toLowerCase();
          if (!email)
            return transition({ type: "start", redirect: adapter.redirect }, { type: "invalid_email" });
          const code = generate();
          await config.sendCode(email, code);
          return transition({
            type: "code",
            code,
            email,
            redirect: adapter.redirect
          });
        }
        if (action === "verify" && adapter.type === "code") {
          const code = fd.get("code")?.toString();
          if (!code || code !== adapter.code)
            return transition(adapter, { type: "invalid_code" });
          return transition({
            type: "update",
            email: adapter.email,
            redirect: adapter.redirect
          });
        }
        if (action === "update" && adapter.type === "update") {
          const existing = await Storage.get(ctx.storage, [
            "email",
            adapter.email,
            "password"
          ]);
          if (!existing)
            return c.redirect(adapter.redirect, 302);
          const password = fd.get("password")?.toString();
          const repeat = fd.get("repeat")?.toString();
          if (!password)
            return transition(adapter, { type: "invalid_password" });
          if (password !== repeat)
            return transition(adapter, { type: "password_mismatch" });
          await Storage.set(ctx.storage, ["email", adapter.email, "password"], await hasher.hash(password));
          const subject = await Storage.get(ctx.storage, [
            "email",
            adapter.email,
            "subject"
          ]);
          if (subject)
            await ctx.invalidate(subject);
          return c.redirect(adapter.redirect, 302);
        }
        return transition({ type: "start", redirect: adapter.redirect });
      });
    }
  };
}
import * as jose from "jose";
import {TextEncoder} from "util";
function PBKDF2Hasher(opts) {
  const iterations = opts?.interations ?? 600000;
  return {
    async hash(password) {
      const encoder = new TextEncoder;
      const bytes = encoder.encode(password);
      const salt = crypto.getRandomValues(new Uint8Array(16));
      const keyMaterial = await crypto.subtle.importKey("raw", bytes, "PBKDF2", false, ["deriveBits"]);
      const hash = await crypto.subtle.deriveBits({
        name: "PBKDF2",
        hash: "SHA-256",
        salt,
        iterations
      }, keyMaterial, 256);
      const hashBase64 = jose.base64url.encode(new Uint8Array(hash));
      const saltBase64 = jose.base64url.encode(salt);
      return {
        hash: hashBase64,
        salt: saltBase64,
        iterations
      };
    },
    async verify(password, compare) {
      const encoder = new TextEncoder;
      const passwordBytes = encoder.encode(password);
      const salt = jose.base64url.decode(compare.salt);
      const params = {
        name: "PBKDF2",
        hash: "SHA-256",
        salt,
        iterations: compare.iterations
      };
      const keyMaterial = await crypto.subtle.importKey("raw", passwordBytes, "PBKDF2", false, ["deriveBits"]);
      const hash = await crypto.subtle.deriveBits(params, keyMaterial, 256);
      const hashBase64 = jose.base64url.encode(new Uint8Array(hash));
      return hashBase64 === compare.hash;
    }
  };
}
import {timingSafeEqual, randomBytes, scrypt} from "crypto";
function ScryptHasher(opts) {
  const N = opts?.N ?? 16384;
  const r = opts?.r ?? 8;
  const p = opts?.p ?? 1;
  return {
    async hash(password) {
      const salt = randomBytes(16);
      const keyLength = 32;
      const derivedKey = await new Promise((resolve, reject) => {
        scrypt(password, salt, keyLength, { N, r, p }, (err, derivedKey2) => {
          if (err)
            reject(err);
          else
            resolve(derivedKey2);
        });
      });
      const hashBase64 = derivedKey.toString("base64");
      const saltBase64 = salt.toString("base64");
      return {
        hash: hashBase64,
        salt: saltBase64,
        N,
        r,
        p
      };
    },
    async verify(password, compare) {
      const salt = Buffer.from(compare.salt, "base64");
      const keyLength = 32;
      const derivedKey = await new Promise((resolve, reject) => {
        scrypt(password, salt, keyLength, { N: compare.N, r: compare.r, p: compare.p }, (err, derivedKey2) => {
          if (err)
            reject(err);
          else
            resolve(derivedKey2);
        });
      });
      return timingSafeEqual(derivedKey, Buffer.from(compare.hash, "base64"));
    }
  };
}
export {
  ScryptHasher,
  PasswordAdapter,
  PBKDF2Hasher
};
