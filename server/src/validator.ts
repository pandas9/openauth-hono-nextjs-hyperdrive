import { User } from "@openauthjs/openauth/subjects";
import { z } from "zod";

export type Variables = {
  user: User;
};

export type Bindings = {
  AUTH_URL: string;
};

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
