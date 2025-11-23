// src/lib/validation/auth.schema.ts
import { object, string, pipe, minLength, maxLength, optional, boolean } from "valibot";

export const loginSchema = object({
  username: pipe(string(), minLength(3), maxLength(50)),
  password: pipe(string(), minLength(4), maxLength(100)),
  rememberMe: optional(boolean()),
});
