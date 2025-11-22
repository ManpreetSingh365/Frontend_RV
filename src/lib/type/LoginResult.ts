export type LoginResult = {
    success: boolean;
    message?: string;
    fieldErrors?: Record<string, string[]>;
};
