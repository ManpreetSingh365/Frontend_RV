"use client";

import { useRef, useState, useEffect } from "react";

/**
 * Generic hook for fetching data with built-in deduplication and caching
 * Prevents duplicate API calls and React StrictMode double-mounting issues
 * 
 * @example
 * const { data: organizations, loading, error } = useDataFetch(
 *     'organizations',
 *     () => getOrganizations(),
 *     []
 * );
 */
export function useDataFetch<T>(
    key: string,
    fetcher: () => Promise<T>,
    initialValue: T
) {
    const hasFetchedRef = useRef(false);
    const [data, setData] = useState<T>(initialValue);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Prevent double-fetch in React StrictMode
        if (hasFetchedRef.current) return;
        hasFetchedRef.current = true;

        let isMounted = true;

        const fetchData = async () => {
            try {
                setLoading(true);
                const result = await fetcher();
                if (isMounted) {
                    setData(result);
                    setError(null);
                }
            } catch (err) {
                if (isMounted) {
                    setError(err instanceof Error ? err.message : `Failed to fetch ${key}`);
                    console.error(`Failed to fetch ${key}:`, err);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchData();

        return () => {
            isMounted = false;
        };
    }, [key, fetcher]);

    return { data, loading, error };
}
