import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { QueryVars } from "../QueryTypes/queryVars";
import { ErrorResponse } from "../QueryTypes/errorResponse";
import SessionContext from "../Context/SessionContext";
import { PostResponse } from "../QueryTypes/postResponse";
import { PostBody } from "../QueryTypes/postBody";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";


export function PostQuery({ children, queryVars, body, skip }: { children: (data: PostResponse | null, loading: boolean, error: ErrorResponse | null) => React.ReactNode, queryVars?: QueryVars, body?: PostBody, skip?: boolean }) {
    const { sessionKey } = useContext(SessionContext);
    const [data, setData] = useState<PostResponse | null>(null);
    const abortController = useMemo(() => new AbortController(), []);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<ErrorResponse | null>(null);
    const { '*': path } = useParams();
    const navigate = useNavigate();
    const posted = useRef(false);

    useEffect(() => {
        if (skip || posted.current || !body) {
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
                        url.searchParams.set(key, encodeURIComponent(`${value}`));
                    }
                });
            }

            try {
                posted.current = true;
                const response = await fetch(url.toString(), {
                    method: 'POST',
                    body: JSON.stringify(body ?? {}),
                    signal: abortController.signal,
                    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }
                });
                if (!response.ok) {
                    setError({
                        status: response.status,
                        message: response.statusText
                    });
                    setLoading(false);
                    return;
                }
                const data = await response.json() as PostResponse;
                if (data['!redirect']) {
                    navigate(data['!redirect']);
                }
                else {
                    setData(data);
                    setLoading(false);
                }
            } catch (error) {
                setError({
                    status: 500,
                    message: error instanceof Error ? error.message : 'An unknown error occurred'
                });
                setLoading(false);
                return;
            }
        }
        fetchData();
    }, [abortController.signal, body, path, queryVars, sessionKey, skip]);

    return children(data, loading, error);
}