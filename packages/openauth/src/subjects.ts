import { object, string } from "valibot";
import { createSubjects } from "./session.js";

export const subjects = createSubjects({
  user: object({
    userID: string(),
    email: string(),
  }),
});
