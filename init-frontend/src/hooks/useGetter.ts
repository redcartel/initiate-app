import { useCallback, useRef, useEffect } from 'react';

export interface GetterOptions {
    /**
     * Additional headers to include in the request
     */
    headers?: HeadersInit;
    /**
     * Whether to include credentials in the request
     */
    credentials?: RequestCredentials;
    /**
     * URL parameters to include in the request
     */
    params?: Record<string, string>;
}

/**
 * Hook to execute a GET request that can be cancelled
 * @param endpoint - The URL to fetch from
 * @param options - Additional options for the request including URL parameters
 * @returns A get function that returns a promise with the JSON response
 */
export function useGetter<T>(
    endpoint: string,
    options: GetterOptions = {}
) {
    const { headers = {}, credentials, params = {} } = options;

    // Keep reference to the current AbortController
    const abortControllerRef = useRef<AbortController | null>(null);

    // Cleanup function to abort any pending requests
    useEffect(() => {
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, []);

    const _params = params;

    const get = useCallback(async ({ params }: { params: Record<string, string> }): Promise<T> => {
        // Abort any existing request
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        // Create new AbortController for this request
        abortControllerRef.current = new AbortController();

        // Construct URL with parameters
        const url = new URL(endpoint);
        Object.entries({ ..._params, ...params }).forEach(([key, value]) => {
            url.searchParams.append(key, value);
        });

        try {
            const response = await fetch(url.toString(), {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    ...headers,
                },
                credentials,
                signal: abortControllerRef.current.signal,
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return response.json();
        } catch (error) {
            // Don't throw aborted request errors
            if (error instanceof Error && error.name === 'AbortError') {
                // Return undefined or handle abort case as needed
                return undefined as T;
            }
            throw error;
        }
    }, [endpoint, headers, credentials, _params]);

    return get;
}