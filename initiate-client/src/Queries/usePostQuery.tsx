import { useContext, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useRef } from "react";
import { useCallback } from "react";
import { QueryVars } from "../QueryTypes/queryVars";
import { PostBody } from "../QueryTypes/postBody";
import { useNavigate } from "react-router-dom";
import { ErrorResponse } from "../QueryTypes/errorResponse";
import { PostResponse } from "../QueryTypes/postResponse";
import SessionContext from "../Context/SessionContext";

export function usePostQuery() {
    const { sessionKey, setErrMsg, setSessionKey } = useContext(SessionContext);
    const [data, setData] = useState<PostResponse | null>(null);
    const abortController = useMemo(() => new AbortController(), []);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<ErrorResponse | null>(null);
    const { '*': path } = useParams();
    const navigate = useNavigate();
    const posted = useRef(false);

    const fetchData = useCallback(async (body: PostBody, queryVars?: QueryVars) => {
        const href = `${import.meta.env.VITE_API_URL ?? 'https://api.d20init.com'}/api/v1`
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
            }
            const data = await response.json();
            if (data['!errorMsg']) {
                setErrMsg(data['!errorMsg']);
                posted.current = false;
                setLoading(false);
            }

            if (data['!newSessionKey']) {
                console.log('setting new session key', data['!newSessionKey']);
                window.localStorage.setItem('sessionKey', data['!newSessionKey']);
                setSessionKey(data['!newSessionKey']);
            }

            if (data['!resetPost']) {
                setData(null);
                posted.current = false;
            }

            if (data['!redirect']) {
                window.location.pathname = data['!redirect'];
            }
            else 
            setData(data);
            setLoading(false);
            return data;
        } catch (error) {
            setError({
                status: 500,
                message: 'Failed to fetch data'
            });
        }
    }, [posted, path, sessionKey, navigate, abortController, setData, setLoading, setError]);

    return { data, loading, error, fetchData };
}