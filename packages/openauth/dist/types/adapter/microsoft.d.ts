import { Oauth2WrappedConfig } from "./oauth2.js";
import { OidcWrappedConfig } from "./oidc.js";
export interface MicrosoftConfig extends Oauth2WrappedConfig {
    tenant: string;
}
export declare function MicrosoftAdapter(config: MicrosoftConfig): {
    type: string;
    init(routes: import("./adapter.js").AdapterRoute, ctx: import("./adapter.js").AdapterOptions<{
        tokenset: import("./oauth2.js").Oauth2Token;
        clientID: string;
    }>): void;
};
export declare function MicrosoftOidcAdapter(config: OidcWrappedConfig): {
    type: string;
    init(routes: import("./adapter.js").AdapterRoute, ctx: import("./adapter.js").AdapterOptions<{
        id: import("hono/utils/jwt/types").JWTPayload;
        clientID: string;
    }>): void;
};
//# sourceMappingURL=microsoft.d.ts.map