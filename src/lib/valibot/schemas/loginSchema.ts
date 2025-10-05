import { object, string, pipe, minLength, maxLength } from "valibot";

export const loginSchema = object({
  username: pipe(string(), minLength(3), maxLength(50)),
  password: pipe(string(), minLength(6), maxLength(100)),
});
