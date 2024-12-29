/* eslint-disable @typescript-eslint/no-explicit-any */
import { RequestHookOptions, useRequest } from './useRequest';

export function usePutter<T = Record<string, any>>(endpoint: string, options?: RequestHookOptions) {
    return useRequest<T>(endpoint, {
        ...options,
        method: 'PUT',
    });
}