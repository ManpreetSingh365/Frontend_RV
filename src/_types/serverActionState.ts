// app/_types/serverActionState.ts
export interface ServerActionState {
    success: boolean;
    errors: Record<string, string>; // field-specific server errors
    message?: string; // general server error or success message
  }
  