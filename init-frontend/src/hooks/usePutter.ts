import { RequestOptions, useRequest } from './useRequest';

export type PutterOptions = Pick<RequestOptions,
    'body' |
    'headers' |
    'params' |
    'execute'
>;

export function usePutter<T = Record<string, unknown>>(endpoint: string, options: PutterOptions) {
    const { request } = useRequest<T>(endpoint, {
        ...options,
        method: 'PUT',
    });
    return request;
}