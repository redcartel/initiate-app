import { RequestHookOptions, useRequest } from './useRequest';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function usePoster<T = Record<string, any>>(endpoint: string, options?: RequestHookOptions) {
    return useRequest<T>(endpoint, {
        ...options,
        method: 'POST',
    });
}