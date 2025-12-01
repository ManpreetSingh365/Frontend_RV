import type { UseQueryResult } from "@tanstack/react-query";

interface QueryDefinition<T> {
    query: UseQueryResult<T, Error>;
}

type EntityDataQueries = Record<string, QueryDefinition<any>>;

export function useEntityData<T extends EntityDataQueries>(queries: T) {
    type DataKeys = keyof T;
    type DataType = {
        [K in DataKeys]: NonNullable<T[K]["query"]["data"]>;
    };

    const queryArray = Object.entries(queries);

    const loading = queryArray.some(([_, { query }]) => query.isLoading);
    const error = queryArray.find(([_, { query }]) => query.error)?.[1].query.error?.message || null;

    const data = queryArray.reduce(
        (acc, [key, { query }]) => {
            const queryData = query.data;
            return {
                ...acc,
                [key]: queryData ?? [], // Default to empty array when data is undefined
            };
        },
        {} as DataType
    );

    const refetch = () => {
        queryArray.forEach(([_, { query }]) => query.refetch());
    };

    return {
        ...data,
        loading,
        error,
        refetch,
    } as DataType & {
        loading: boolean;
        error: string | null;
        refetch: () => void;
    };
}
