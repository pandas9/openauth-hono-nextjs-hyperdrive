// src/adapter/code.ts
function CodeAdapter(config) {
  const length = config.length || 6;
  function generate() {
    const buffer = crypto.getRandomValues(new Uint8Array(length));
    const otp = Array.from(buffer).map((byte) => byte % 10).join("");
    return otp;
  }
  return {
    type: "code",
    init(routes, ctx) {
      async function transition(c, next, fd, err) {
        await ctx.set(c, "adapter", 86400, next);
        const resp = ctx.forward(c, await config.request(c.req.raw, next, fd, err));
        return resp;
      }
      routes.get("/authorize", async (c) => {
        const resp = await transition(c, {
          type: "start"
        });
        return resp;
      });
      routes.post("/authorize", async (c) => {
        const code = generate();
        const fd = await c.req.formData();
        const state = await ctx.get(c, "adapter");
        const action = fd.get("action")?.toString();
        if (action === "request" || action === "resend") {
          const claims = Object.fromEntries(fd);
          delete claims.action;
          const err = await config.sendCode(claims, code);
          if (err)
            return transition(c, { type: "start" }, fd, err);
          return transition(c, {
            type: "code",
            resend: action === "resend",
            claims,
            code
          }, fd);
        }
        if (fd.get("action")?.toString() === "verify" && state.type === "code") {
          const fd2 = await c.req.formData();
          const compare = fd2.get("code")?.toString();
          if (!state.code || !compare || state.code !== compare) {
            return transition(c, {
              ...state,
              resend: false
            }, fd2, { type: "invalid_code" });
          }
          await ctx.unset(c, "adapter");
          return ctx.forward(c, await ctx.success(c, { claims: state.claims }));
        }
      });
    }
  };
}
export {
  CodeAdapter
};
