// src/lib/api/types.ts

export interface ApiResponse<T> {
    success: boolean;
    message: string | null;
    data: T | null;
    errors: any[] | null;
    meta: any | null;
}

export interface PaginationMeta {
    totalElements: number;
    totalPages: number;
    currentPageNo: number;
    firstPage: boolean;
    lastPage: boolean;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

export interface PaginatedResponse<T> {
    data: T[];
    meta: PaginationMeta;
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
