import { RequestOptions, useRequest } from './useRequest';

export type PosterOptions = Pick<RequestOptions,
    'body' |
    'headers' |
    'params' |
    'execute'
>;

export function usePoster<T = Record<string, unknown>>(endpoint: string, options: PosterOptions) {
    const { request } = useRequest<T>(endpoint, {
        ...options,
        method: 'POST',
    });
    return request;
}