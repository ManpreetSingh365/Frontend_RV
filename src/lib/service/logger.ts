// src/lib/logger.ts

type LogLevel = "info" | "warn" | "error" | "debug";

interface LogOptions {
    source?: string;   // optional manual override
    data?: unknown;
}

// Extract caller file name from stack trace
function getCallerSource(): string {
    try {
        const error = new Error();
        const stack = error.stack?.split("\n");

        // Adjust index if needed based on runtime
        const callerLine = stack?.[3] || "";

        const match = callerLine.match(/\/([^\/]+\.ts|\.tsx)/);
        return match?.[1] || "unknown";
    } catch {
        return "unknown";
    }
}

function formatMessage(
    level: LogLevel,
    message: string,
    source?: string
) {
    const timestamp = new Date().toISOString();
    const tag = source ? `[${source}]` : "";
    return `[${timestamp}] [${level.toUpperCase()}] ${tag} ${message}`;
}

function log(level: LogLevel, message: string, options?: LogOptions) {
    const source = options?.source || getCallerSource();
    const logMessage = formatMessage(level, message, source);

    if (options?.data) {
        console[level](logMessage, options.data);
    } else {
        console[level](logMessage);
    }
}

export const logger = {
    info: (message: string, options?: LogOptions) =>
        log("info", message, options),

    warn: (message: string, options?: LogOptions) =>
        log("warn", message, options),

    error: (message: string, options?: LogOptions) =>
        log("error", message, options),

    debug: (message: string, options?: LogOptions) => {
        if (process.env.NODE_ENV !== "production") {
            log("debug", message, options);
        }
    },
};
