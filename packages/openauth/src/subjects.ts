import { InferInput, number, object, string } from "valibot";
import { createSubjects } from "./session.js";

export const subjects = createSubjects({
  user: object({
    userID: number(),
    email: string(),
  }),
});

export type User = InferInput<typeof subjects.user>;
