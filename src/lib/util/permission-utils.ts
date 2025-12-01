/**
 * Utility functions for permission management
 */

export interface PermissionCategory {
    category: string;
    permissions: string[];
}

/**
 * Formats a category name from snake_case to Title Case
 * @example "USER_MANAGEMENT" => "User Management"
 */
export function formatCategoryName(category: string): string {
    return category
        .split('_')
        .map(word => word.charAt(0) + word.slice(1).toLowerCase())
        .join(' ');
}

/**
 * Formats a permission name to a readable label
 * @example "USER_CREATE" => "Create"
 */
export function formatPermissionName(permission: string): string {
    // Split by underscore and take the action part (last segment)
    const parts = permission.split('_');

    // For simple actions like CREATE, READ, UPDATE, DELETE
    const simpleActions = ['CREATE', 'READ', 'UPDATE', 'DELETE', 'SOFT_DELETE', 'HARD_DELETE', 'RESTORE'];

    if (parts.length === 2 && simpleActions.includes(parts[1])) {
        return formatAction(parts[1]);
    }

    // For multi-word actions, join the action parts
    const actionParts = parts.slice(1);
    return actionParts
        .map(word => word.charAt(0) + word.slice(1).toLowerCase())
        .join(' ');
}

/**
 * Formats an action word
 */
function formatAction(action: string): string {
    const actionMap: Record<string, string> = {
        'CREATE': 'Create',
        'READ': 'Read',
        'UPDATE': 'Update',
        'DELETE': 'Delete',
        'SOFT_DELETE': 'Soft Delete',
        'HARD_DELETE': 'Hard Delete',
        'RESTORE': 'Restore',
    };
    return actionMap[action] || action;
}

/**
 * Calculates the selection state of a category
 */
export function getCategorySelectionState(
    categoryPermissions: string[],
    selectedPermissions: string[]
): 'all' | 'some' | 'none' {
    const selectedCount = categoryPermissions.filter(p =>
        selectedPermissions.includes(p)
    ).length;

    if (selectedCount === 0) return 'none';
    if (selectedCount === categoryPermissions.length) return 'all';
    return 'some';
}

/**
 * Toggles all permissions in a category
 */
export function toggleCategoryPermissions(
    categoryPermissions: string[],
    currentSelected: string[],
    selectAll: boolean
): string[] {
    if (selectAll) {
        // Add all category permissions
        const newSet = new Set([...currentSelected, ...categoryPermissions]);
        return Array.from(newSet);
    } else {
        // Remove all category permissions
        return currentSelected.filter(p => !categoryPermissions.includes(p));
    }
}
