import { useCallback, useRef, useEffect } from 'react';
import { useAppState } from './useAppState';

interface SubmitterOptions {
    /**
     * Additional headers to include in the request
     */
    headers?: HeadersInit;
    /**
     * Whether to include credentials in the request
     */
    credentials?: RequestCredentials;
}

/**
 * Hook to submit a specific state value to a POST endpoint
 * @param endpoint - The URL to submit to
 * @param stateKey - The top-level key in the app state to submit
 * @param options - Additional options for the submission
 * @returns A submit function that returns a promise with the response
 */
export function useAppStateSubmitter(
    endpoint: string,
    stateKey: string | undefined,
    options: SubmitterOptions = {}
) {
    const { state } = useAppState();
    const { headers = {}, credentials } = options;

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

    const submit = useCallback(async () => {
        // Abort any existing request
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        // Create new AbortController for this request
        abortControllerRef.current = new AbortController();

        const value = stateKey !== undefined ? state[stateKey] : state;
        if (value === undefined) {
            throw new Error(`No value found in state for key: ${stateKey}`);
        }

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...headers,
                },
                body: JSON.stringify(value),
                credentials,
                signal: abortControllerRef.current.signal,
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return response;
        } catch (error) {
            // Don't throw aborted request errors
            if (error instanceof Error && error.name === 'AbortError') {
                // Return undefined or handle abort case as needed
                return;
            }
            throw error;
        }
    }, [state, stateKey, endpoint, headers, credentials]);

    return submit;
}