// src/subjects.ts
import {number, object, string} from "valibot";
import {createSubjects} from "./session.js";
var subjects = createSubjects({
  user: object({
    userID: number(),
    email: string()
  })
});
export {
  subjects
};
