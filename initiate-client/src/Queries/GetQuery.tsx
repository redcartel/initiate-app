import { useEffect, useMemo } from "react";
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

export const GetQuery = ({ children, skip, queryVars }: { children: (data: GetResponse | null, loading: boolean, error: Error | null) => React.ReactNode, skip?: boolean, queryVars?: QueryVars }) => {
    const { sessionKey } = useContext(SessionContext);
    const { '*': path } = useParams();

    const [data, setData] = useState<GetResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);
    const abortController = useMemo(() => new AbortController(), []);

    useEffect(() => {
        if (skip) {
            return;
        }
        const fetchData = async () => {
            const href = `${import.meta.env.VITE_API_URL ?? 'http://localhost:3031'}/api/v1`
            const url = new URL(href);
            url.searchParams.set('sessionKey', encodeURIComponent(sessionKey));
            url.searchParams.set('path', encodeURIComponent(path ?? ''));

            if (queryVars) {
                Object.entries(queryVars).forEach(([key, value]) => {
                    if (queryVars[key as keyof QueryVars] !== undefined) {
                        url.searchParams.set(key, encodeURIComponent(value));
                    }
                });
            }

            const response = await fetch(url.toString(), { signal: abortController.signal, headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' } });
            if (!response.ok) {
                setError({
                    status: response.status,
                    message: response.statusText
                });
                setLoading(false);
                return;
            }
            const data = await response.json();
            console.log('GetQuery data', data);
            setData(data);
            setLoading(false);
        }
        fetchData();

        // return () => abortController.abort();
    }, [sessionKey, path, abortController, queryVars, skip]);

    return children(data, loading, error);
}