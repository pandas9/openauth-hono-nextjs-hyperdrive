// src/subjects.ts
import {object, string} from "valibot";
import {createSubjects} from "./session.js";
var subjects = createSubjects({
  user: object({
    userID: string(),
    email: string()
  })
});
export {
  subjects
};
