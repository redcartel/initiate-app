import { RequestHookOptions, useRequest } from './useRequest';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useDeleter<T = Record<string, any>>(endpoint: string, options?: RequestHookOptions) {
    const { request } = useRequest<T>(endpoint, { ...options, method: 'DELETE' });
    return request;
}