import { RequestOptions, useRequest } from './useRequest';

export type DeleterOptions = Pick<RequestOptions,
    'headers' |
    'params' |
    'execute'
>;

export function useDeleter<T = Record<string, unknown>>(endpoint: string, options: DeleterOptions) {
    const { request } = useRequest<T>(endpoint, { ...options, method: 'DELETE' });
    return request;
}