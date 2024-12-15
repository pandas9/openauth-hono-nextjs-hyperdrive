// src/client.ts
import {
createLocalJWKSet,
errors,
jwtVerify,
decodeJwt
} from "jose";
import {
InvalidAccessTokenError,
InvalidAuthorizationCodeError,
InvalidRefreshTokenError,
InvalidSubjectError
} from "./error.js";
import {generatePKCE} from "./pkce.js";
function createClient(input) {
  const jwksCache = new Map;
  const issuerCache = new Map;
  const issuer = input.issuer || process.env.OPENAUTH_ISSUER;
  if (!issuer)
    throw new Error("No issuer");
  const f = input.fetch ?? fetch;
  async function getIssuer() {
    const cached = issuerCache.get(issuer);
    if (cached)
      return cached;
    const wellKnown = await (f || fetch)(`${issuer}/.well-known/oauth-authorization-server`).then((r) => r.json());
    issuerCache.set(issuer, wellKnown);
    return wellKnown;
  }
  async function getJWKS() {
    const wk = await getIssuer();
    const cached = jwksCache.get(issuer);
    if (cached)
      return cached;
    const keyset = await (f || fetch)(wk.jwks_uri).then((r) => r.json());
    const result2 = createLocalJWKSet(keyset);
    jwksCache.set(issuer, result2);
    return result2;
  }
  const result = {
    async authorize(redirectURI, response, opts) {
      const result2 = new URL(issuer + "/authorize");
      const challenge = {
        state: crypto.randomUUID()
      };
      result2.searchParams.set("client_id", input.clientID);
      result2.searchParams.set("redirect_uri", redirectURI);
      result2.searchParams.set("response_type", response);
      result2.searchParams.set("state", challenge.state);
      if (opts?.provider)
        result2.searchParams.set("provider", opts.provider);
      if (opts?.pkce && response === "code") {
        const pkce2 = await generatePKCE();
        result2.searchParams.set("code_challenge_method", "S256");
        result2.searchParams.set("code_challenge", pkce2.challenge);
        challenge.verifier = pkce2.verifier;
      }
      return {
        challenge,
        url: result2.toString()
      };
    },
    async pkce(redirectURI, opts) {
      const result2 = new URL(issuer + "/authorize");
      if (opts?.provider)
        result2.searchParams.set("provider", opts.provider);
      result2.searchParams.set("client_id", input.clientID);
      result2.searchParams.set("redirect_uri", redirectURI);
      result2.searchParams.set("response_type", "code");
      const pkce2 = await generatePKCE();
      result2.searchParams.set("code_challenge_method", "S256");
      result2.searchParams.set("code_challenge", pkce2.challenge);
      return [pkce2.verifier, result2.toString()];
    },
    async exchange(code, redirectURI, verifier) {
      const tokens = await f(issuer + "/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams({
          code,
          redirect_uri: redirectURI,
          grant_type: "authorization_code",
          client_id: input.clientID,
          code_verifier: verifier || ""
        }).toString()
      });
      const json = await tokens.json();
      if (!tokens.ok) {
        return {
          err: new InvalidAuthorizationCodeError
        };
      }
      return {
        err: false,
        tokens: {
          access: json.access_token,
          refresh: json.refresh_token
        }
      };
    },
    async refresh(refresh, opts) {
      if (opts && opts.access) {
        const decoded = decodeJwt(opts.access);
        if (!decoded) {
          return {
            err: new InvalidAccessTokenError
          };
        }
        if ((decoded.exp || 0) > Date.now() / 1000 + 30) {
          return {
            err: false
          };
        }
      }
      const tokens = await f(issuer + "/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams({
          grant_type: "refresh_token",
          refresh_token: refresh
        }).toString()
      });
      const json = await tokens.json();
      if (!tokens.ok) {
        return {
          err: new InvalidRefreshTokenError
        };
      }
      return {
        err: false,
        tokens: {
          access: json.access_token,
          refresh: json.refresh_token
        }
      };
    },
    async verify(subjects, token, options) {
      const jwks = await getJWKS();
      try {
        const result2 = await jwtVerify(token, jwks, {
          issuer
        });
        const validated = await subjects[result2.payload.type]["~standard"].validate(result2.payload.properties);
        if (!validated.issues && result2.payload.mode === "access")
          return {
            aud: result2.payload.aud,
            subject: {
              type: result2.payload.type,
              properties: validated.value
            }
          };
        return {
          err: new InvalidSubjectError
        };
      } catch (e) {
        if (e instanceof errors.JWTExpired && options?.refresh) {
          const refreshed = await this.refresh(options.refresh);
          if (refreshed.err)
            return refreshed;
          const verified = await result.verify(subjects, refreshed.tokens.access, {
            refresh: refreshed.tokens.refresh,
            issuer,
            fetch: options?.fetch
          });
          if (verified.err)
            return verified;
          verified.tokens = refreshed.tokens;
          return verified;
        }
        return {
          err: new InvalidAccessTokenError
        };
      }
    }
  };
  return result;
}
export {
  createClient
};
