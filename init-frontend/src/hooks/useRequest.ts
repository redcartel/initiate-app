/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useRef, useEffect, useState } from 'react';
import { useAppState } from './useAppState';

export type RequestOptions = {
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
            body?: unknown,
        }
    )

type RequestError<T> = Error & Partial<T> & { error?: number, errorMessage?: string }

/**
 * Hook to execute a GET request that can be cancelled
 * @param endpoint - The URL to fetch from
 * @param options : RequestOptions - Additional options for the request including URL parameters
 * @returns A get function that returns a promise with the JSON response
 */
export function useRequest<T = Record<string, unknown>>(endpoint: string, options: RequestOptions): {
    request: ({ params, body }: { params: Record<string, string>, body: unknown }) => Promise<T>,
    data: T | null,
    error: RequestError<T> | null,
} {


    // destructure options with default valu

    const [data, setData] = useState<T | null>(null);
    const [error, setError] = useState<RequestError<T> | null>(null);
    const { state } = useAppState();
    //
    const { headers: _headers, params: _params, body: _body = undefined, method: _method = 'GET'
    } = {
        ...options,
        headers: {
            ...(options.headers ?? {}),
            'Content-Type': 'application/json',
            'Authorization': options.headers?.Authorization ?? state.gameId ? `Bearer ${state.gameId}${state.userId ? `:${state.userId}` : ''}` : undefined,
            'Accept': 'application/json',
            'no-cache': 'true',
        },
    }

    // Keep reference to the current AbortController
    const abortControllerRef = useRef<AbortController | null>(null);

    // Cleanup function to abort any pending requests
    useEffect(() => {
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, []);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const request = useCallback(async ({ params, body }: { params: Record<string, string>, body: any }): Promise<T> => {
        // Abort any existing request
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        // Create new AbortController for this request
        abortControllerRef.current = new AbortController();
        const signal = abortControllerRef.current.signal;

        // Construct URL with parameters
        const url = new URL(endpoint);

        // Add search params to the URL
        Object.entries({ ..._params, ...params }).forEach(([key, value]) => {
            url.searchParams.append(key, value);
        });

        try {
            const response = await fetch(url.toString(), {
                method: _method,
                headers: { ..._headers } as Record<string, string>,
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
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    throw ((new Error(_data.errorMessage) as any) & _data) as Error & typeof data;
                }
                else {
                    setData(data);
                    return data;
                }
            });
        } catch (error) {
            const _data = {
                error: (error as any).status ? (error as any).status : 418,
                errorMessage: error instanceof Error && error.message ? error.message : 'I\'m a teapot (unknown error)',
                ...(error as any),
            }
            setError(_data);
            return _data as T;
        }
    }, [endpoint, _params, _method, _headers, _body]);

    return {
        request,
        data,
        error
    }
}