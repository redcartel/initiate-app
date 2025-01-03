import { useCallback, useEffect, useMemo, useRef } from "react";
import { useState } from "react";
import { useContext } from "react";
import SessionContext from "../Context/SessionContext";
import { useParams } from "react-router-dom";
import { GetResponse } from "../QueryTypes/getResponse";
import { QueryVars } from "../QueryTypes/queryVars";

interface Error {
    status: number;
    message: string;
}

export const GetQuery = ({ children, skip, queryVars, poll }: { children: (data: GetResponse | null, loading: boolean, error: Error | null) => React.ReactNode, skip?: boolean, queryVars?: QueryVars, poll?: boolean }) => {
    const { sessionKey, setErrMsg } = useContext(SessionContext);
    const { '*': path } = useParams();

    const [data, setData] = useState<GetResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);
    const abortController = useMemo(() => new AbortController(), []);

    const [pollForPath, setPollForPath] = useState<string | null>(null);
    const pollInterval = useRef<number | null>(null);

    const fetchData = useCallback(async (path: string) => {
            console.log('fetch for', path);
            const href = `${import.meta.env.VITE_API_URL ?? 'http://localhost:3031'}/api/v1`
            const url = new URL(href);
            url.searchParams.set('sessionKey', encodeURIComponent(localStorage.getItem('sessionKey') ?? ''));
            url.searchParams.set('path', encodeURIComponent(path ?? ''));

            if (queryVars) {
                Object.entries(queryVars).forEach(([key, value]) => {
                    if (queryVars[key as keyof QueryVars] !== undefined) {
                        url.searchParams.set(key, encodeURIComponent(value));
                    }
                });
            }

            const response = await fetch(url.toString(), { signal: abortController.signal, headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, cache: 'no-store' });
            if (!response.ok) {
                setError({
                    status: response.status,
                    message: response.statusText
                });
                setLoading(false);
                return;
            } 
            const data = await response.json() as GetResponse;
            if (data.content.type === 'select' && data.content.poll) {
                console.log('Poll TrueGetQuery poll,data', poll,data);
                setPollForPath(path);
            }

            if (data.errorMsg) {
                setErrMsg(data.errorMsg);
            }

            if (data.content.type === 'redirect') {
                window.location.href = data.content.href;
            }

            setData(data);
            setLoading(false);
    }, [sessionKey, path, abortController, queryVars, skip]);

    useEffect(() => {
        if (pollForPath !== null && pollForPath === path) {
            pollInterval.current = setInterval(() => fetchData(pollForPath), 500) as unknown as number;
        }
        else if (pollInterval.current) {
            clearInterval(pollInterval.current);
            pollInterval.current = null;
            setPollForPath(null);
        }
        // return () => {
        //     if (pollInterval.current) {
        //         clearInterval(pollInterval.current);
        //         setPollForPath(null);
        //     }
        // }
    }, [pollForPath, fetchData]);

    useEffect(() => {
        if (path !== undefined) {
            fetchData(path);
        }
        return () => {
            if (pollInterval.current) {
                clearInterval(pollInterval.current);
                setPollForPath(null);
            }
        }
    }, [path]);

    return children(data, loading, error);
}