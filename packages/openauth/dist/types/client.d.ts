import { SubjectSchema } from "./session.js";
import type { v1 } from "@standard-schema/spec";
import { InvalidAccessTokenError, InvalidAuthorizationCodeError, InvalidRefreshTokenError } from "./error.js";
export interface WellKnown {
    jwks_uri: string;
    token_endpoint: string;
    authorization_endpoint: string;
}
export interface Tokens {
    access: string;
    refresh: string;
}
interface ResponseLike {
    json(): Promise<unknown>;
    ok: Response["ok"];
}
type FetchLike = (...args: any[]) => Promise<ResponseLike>;
export type Challenge = {
    state: string;
    verifier?: string;
};
export declare function createClient(input: {
    clientID: string;
    issuer?: string;
    fetch?: FetchLike;
}): {
    authorize(redirectURI: string, response: "code" | "token", opts?: {
        pkce?: boolean;
        provider?: string;
    }): Promise<{
        challenge: Challenge;
        url: string;
    }>;
    /**
     * @deprecated use `authorize` instead, it will do pkce by default unless disabled with `opts.pkce = false`
     */
    pkce(redirectURI: string, opts?: {
        provider?: string;
    }): Promise<string[]>;
    exchange(code: string, redirectURI: string, verifier?: string): Promise<{
        err: false;
        tokens: Tokens;
    } | {
        err: InvalidAuthorizationCodeError;
    }>;
    refresh(refresh: string, opts?: {
        access?: string;
    }): Promise<{
        err: false;
        tokens?: Tokens;
    } | {
        err: InvalidRefreshTokenError | InvalidAccessTokenError;
    }>;
    verify<T extends SubjectSchema>(subjects: T, token: string, options?: {
        refresh?: string;
        issuer?: string;
        audience?: string;
        fetch?: typeof fetch;
    }): Promise<{
        err?: undefined;
        tokens?: Tokens;
        aud: string;
        subject: { [type in keyof T]: {
            type: type;
            properties: v1.InferOutput<T[type]>;
        }; }[keyof T];
    } | {
        err: InvalidRefreshTokenError | InvalidAccessTokenError;
    }>;
};
export {};
//# sourceMappingURL=client.d.ts.map