// src/lib/api/types.ts

export interface ApiResponse<T> {
    success: boolean;
    message: string | null;
    data: T | null;
    errors: any[] | null;
    meta: any | null;
}

export interface ApiErrorResponse {
    success?: boolean;
    code?: string;
    messages?: string[];
    errors?: {
        field: string;
        message: string;
    }[];
}

export class ApiError extends Error {
    status: number;
    messages: string[];
    fieldErrors: { field: string; message: string }[];

    constructor(
        status: number,
        messages: string[] = [],
        fieldErrors: { field: string; message: string }[] = []
    ) {
        super(messages.join(", ") || "Request failed");
        this.name = "ApiError";
        this.status = status;
        this.messages = messages;
        this.fieldErrors = fieldErrors;
    }
}
