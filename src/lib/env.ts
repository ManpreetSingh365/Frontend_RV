import { object, pipe, string, url, safeParse } from "valibot";

const envSchema = object({
  FRONTEND_PATH: pipe(string(), url()),
  BACKEND_PATH: pipe(string(), url()),
});

function validateEnv() {
  const parsed = safeParse(envSchema, process.env);
  if (!parsed.success) {
    throw new Error(
      `Invalid environment variables: ${JSON.stringify(parsed.issues)}`
    );
  }
  return parsed.output;
}

export const env = validateEnv();
