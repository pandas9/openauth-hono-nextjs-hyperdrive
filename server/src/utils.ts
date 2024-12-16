import { createClient } from "@openauthjs/openauth/client";
import { User } from "@openauthjs/openauth/subjects";

export type Variables = {
  user: User;
};

export type Bindings = {
  AUTH_URL: string;
};

let cachedClient: ReturnType<typeof createClient> | null = null;

export function getClient(issuer: string) {
  if (cachedClient) {
    return cachedClient;
  }

  cachedClient = createClient({
    clientID: "server",
    issuer,
  });

  return cachedClient;
}
