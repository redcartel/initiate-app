import { RequestOptions, useRequest } from './useRequest';

export type PutterOptions = Pick<RequestOptions,
    'body' |
    'headers' |
    'params' |
    'execute'
>;

export function usePutter<T = Record<string, unknown>>(endpoint: string, options: PutterOptions) {
    return useRequest<T>(endpoint, {
        ...options,
        method: 'PUT',
    });
}