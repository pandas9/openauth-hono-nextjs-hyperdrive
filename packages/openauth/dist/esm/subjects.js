// src/subjects.ts
import {
nullable,
number,
object,
optional,
string
} from "valibot";
import {createSubjects} from "./session.js";
var subjects = createSubjects({
  user: object({
    userID: optional(nullable(number())),
    email: string()
  })
});
export {
  subjects
};
