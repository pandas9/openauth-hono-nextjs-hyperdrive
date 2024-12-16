import { nullable, number, object, optional, string } from "valibot";
import { createSubjects } from "./session.js";

export const subjects = createSubjects({
  user: object({
    userID: optional(nullable(number())),
    email: string(),
  }),
});
