import { User } from "@openauthjs/openauth/subjects";
import { z } from "zod";
import { routes } from ".";

export type Variables = {
  user: User;
};

export type Bindings = {
  AUTH_URL: string;
  KV: KVNamespace;
  HYPERDRIVE: Hyperdrive;
};

export type Env = {
  Variables: Variables;
  Bindings: Bindings;
};

export type Routes = typeof routes;

export const userSchema = z.object({
  name: z
    .string({
      required_error: "Name is required",
    })
    .min(1, "Name cannot be empty"),
  age: z
    .number({
      required_error: "Age is required",
    })
    .min(1, "Age cannot be empty"),
});

export interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  max: number; // Max number of requests within the window
}
