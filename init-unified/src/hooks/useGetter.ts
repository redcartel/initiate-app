import { RequestHookOptions, useRequest } from './useRequest';

/**
 * Hook to execute a GET request that can be cancelled
 * @param endpoint - The URL to fetch from
 * @param options - Additional options for the request including URL parameters
 * @returns A get function that returns a promise with the JSON response
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useGetter<T = Record<string, any>>(
    endpoint: string,
    options?: RequestHookOptions
) {
    return useRequest<T>(endpoint, {
        ...options,
        method: 'GET',
    });
}