import { RequestOptions, useRequest } from './useRequest';

export type GetterOptions = Pick<RequestOptions,
    'headers' |
    'params' |
    'execute'
>;

/**
 * Hook to execute a GET request that can be cancelled
 * @param endpoint - The URL to fetch from
 * @param options - Additional options for the request including URL parameters
 * @returns A get function that returns a promise with the JSON response
 */
export function useGetter<T = Record<string, unknown>>(
    endpoint: string,
    options: GetterOptions = {}
) {
    return useRequest<T>(endpoint, {
        ...options,
        method: 'GET',
    });
}