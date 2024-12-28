/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useRef, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export type RequestHookOptions = {
    /**
     * Additional headers to include in the request
     */
    headers?: Record<string, string>;
    /**
     * URL parameters to include in the request
     */
    params?: Record<string, string>;
    /**
     * Whether to execute the request immediately
     */
    execute?: boolean;
} & (
        {
            method: 'GET' | 'DELETE',
            body?: undefined,
        } | {
            method: 'POST' | 'PUT',
            body?: any,
        }
    )

export type RequestOptions = {
    headers?: Record<string, string>;
    params?: Record<string, string>;
    body?: any;
}

type RequestError<T> = Error & Partial<T> & { error?: number, errorMessage?: string }

/**
 * Hook to execute a GET request that can be cancelled
 * @param endpoint - The URL to fetch from
 * @param options : RequestOptions - Additional options for the request including URL parameters
 * @returns A get function that returns a promise with the JSON response
 */
export function useRequest<T = Record<string, any>>(endpoint: string, options?: RequestHookOptions): {
    request: ({ params, body, headers }: RequestOptions) => Promise<T>,
    data: T | null,
    error: RequestError<T> | null,
    loading: boolean,
    abortController: AbortController | null,
} {


    // destructure options with default value
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<RequestError<T> | null>(null);
    const params = useParams();
    const executeHappened = useRef(false);

    const { headers: _headers, params: _params = {}, body: _body = undefined, method: _method = 'GET'
    } = {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': options?.headers?.Authorization ?? params.gameId ? `Bearer ${params.gameId}:${params.characterId}` : undefined,
            'Accept': 'application/json',
            'no-cache': 'true',
            ...(options?.headers ?? {}),
        },
    }

    // Keep reference to the current AbortController
    const abortControllerRef = useRef<AbortController | null>(null);

    // Cleanup function to abort any pending requests
    // useEffect(() => {
    //     return () => {
    //         if (abortControllerRef.current) {
    //             abortControllerRef.current.abort();
    //         }
    //     };
    // }, []);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const request = useCallback(async ({ params, body, headers }: RequestOptions): Promise<T> => {
        setLoading(true);
        // Abort any existing request
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        // Create new AbortController for this request
        abortControllerRef.current = new AbortController();
        const signal = abortControllerRef.current.signal;

        // Construct URL with parameters
        const href = /^https?:\/\//.test(endpoint) ? new URL(endpoint) : new URL(`${import.meta.env.VITE_API_URL}${endpoint}`);

        const url = new URL(href.href);

        // Add search params to the URL
        Object.entries({ ..._params, ...params }).forEach(([key, value]) => {
            url.searchParams.append(key, value);
        });

        try {
            const response = await fetch(url.toString(), {
                method: _method,
                headers: { ..._headers, ...headers } as Record<string, string>,
                body: (_method === 'GET' || _method === 'DELETE') ? undefined : JSON.stringify(body ?? _body ?? {}),
                signal,
            });

            return response.json().then(data => {
                if (!response.ok) {
                    const _data = {
                        error: data.error ?? response.status,
                        errorMessage: data.errorMessage ?? response.statusText,
                        ...data,
                    }
                    setLoading(false);
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    throw ((new Error(_data.errorMessage) as any) & { ..._data, status: response?.status }) as Error & typeof data;
                }
                else {
                    setData(data);
                    setLoading(false);
                    return data;
                }
            });
        } catch (error) {
            setLoading(false);
            const _data = {
                error: (error as any).status ? (error as any).status : 418,
                errorMessage: error instanceof Error && error.message ? error.message : 'I\'m a teapot (unknown error)',
                ...(error as any),
            }
            setError(_data);
            return _data as T;
        }
    }, [endpoint, _params, _method, _headers, _body]);

    useEffect(() => {
        if (options?.execute && !executeHappened.current && !error) {
            executeHappened.current = true;
            request({ params: _params ?? {}, body: _body ?? {} });
        }
    }, [options?.execute, request, _params, _body, error]);

    return {
        request,
        data,
        error,
        loading,
        abortController: abortControllerRef.current,
    }
}