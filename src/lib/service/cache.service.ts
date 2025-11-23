// src/lib/cache.service.ts
import { revalidatePath, revalidateTag } from "next/cache";

/**
 * Revalidate by route path (use after mutations).
 * Example: revalidateRoute("/users")
 */
export function revalidateRoute(path: string) {
    if (!path) return;
    revalidatePath(path);
}

/**
 * Revalidate by cache tag.
 * Example: revalidateByTag(CacheTags.USERS)
 */
export function revalidateByTag(tag: string) {
    if (!tag) return;
    revalidateTag(tag);
}

/**
 * Centralized cache tags to avoid string duplication.
 * revalidateByTag(CacheTags.USERS);
 */
export const CacheTags = {
    USERS: "users",
    VEHICLES: "vehicles",
    DEVICES: "devices",
    ROLES: "roles",
} as const;