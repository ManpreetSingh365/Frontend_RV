/**
 * Filter evaluation utilities for advanced filtering
 */

export type FilterOperator =
    | "equals"
    | "notEquals"
    | "contains"
    | "notContains"
    | "startsWith"
    | "endsWith"
    | "gt"
    | "gte"
    | "lt"
    | "lte"
    | "between"
    | "isEmpty"
    | "isNotEmpty";

export interface FilterCondition {
    id: string;
    field: string;
    operator: FilterOperator;
    value: any;
    value2?: any; // For 'between' operator
}

/**
 * Get the value from a nested object path
 */
function getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
}

/**
 * Evaluate a single filter condition against a row
 */
export function evaluateCondition(row: any, condition: FilterCondition): boolean {
    const value = getNestedValue(row, condition.field);

    switch (condition.operator) {
        case "isEmpty":
            return value === null || value === undefined || value === "";

        case "isNotEmpty":
            return value !== null && value !== undefined && value !== "";

        case "equals":
            return String(value).toLowerCase() === String(condition.value).toLowerCase();

        case "notEquals":
            return String(value).toLowerCase() !== String(condition.value).toLowerCase();

        case "contains":
            return String(value)
                .toLowerCase()
                .includes(String(condition.value).toLowerCase());

        case "notContains":
            return !String(value)
                .toLowerCase()
                .includes(String(condition.value).toLowerCase());

        case "startsWith":
            return String(value)
                .toLowerCase()
                .startsWith(String(condition.value).toLowerCase());

        case "endsWith":
            return String(value)
                .toLowerCase()
                .endsWith(String(condition.value).toLowerCase());

        case "gt":
            return Number(value) > Number(condition.value);

        case "gte":
            return Number(value) >= Number(condition.value);

        case "lt":
            return Number(value) < Number(condition.value);

        case "lte":
            return Number(value) <= Number(condition.value);

        case "between":
            const numValue = Number(value);
            return (
                numValue >= Number(condition.value) &&
                numValue <= Number(condition.value2)
            );

        default:
            return true;
    }
}

/**
 * Apply advanced filters to data
 */
export function applyAdvancedFilters(
    data: any[],
    conditions: FilterCondition[],
    logic: "AND" | "OR" = "AND"
): any[] {
    if (conditions.length === 0) return data;

    return data.filter((row) => {
        if (logic === "AND") {
            return conditions.every((cond) => evaluateCondition(row, cond));
        } else {
            return conditions.some((cond) => evaluateCondition(row, cond));
        }
    });
}

/**
 * Get operator display name
 */
export function getOperatorLabel(operator: FilterOperator): string {
    const labels: Record<FilterOperator, string> = {
        equals: "Equals",
        notEquals: "Not Equals",
        contains: "Contains",
        notContains: "Does Not Contain",
        startsWith: "Starts With",
        endsWith: "Ends With",
        gt: "Greater Than",
        gte: "Greater Than or Equal",
        lt: "Less Than",
        lte: "Less Than or Equal",
        between: "Between",
        isEmpty: "Is Empty",
        isNotEmpty: "Is Not Empty",
    };
    return labels[operator] || operator;
}

/**
 * Get available operators for a field type
 */
export function getOperatorsForType(type: "string" | "number" | "date" | "boolean"): FilterOperator[] {
    switch (type) {
        case "string":
            return [
                "equals",
                "notEquals",
                "contains",
                "notContains",
                "startsWith",
                "endsWith",
                "isEmpty",
                "isNotEmpty",
            ];
        case "number":
            return ["equals", "notEquals", "gt", "gte", "lt", "lte", "between", "isEmpty", "isNotEmpty"];
        case "date":
            return ["equals", "gt", "gte", "lt", "lte", "between", "isEmpty", "isNotEmpty"];
        case "boolean":
            return ["equals", "notEquals"];
        default:
            return ["equals", "notEquals", "isEmpty", "isNotEmpty"];
    }
}
