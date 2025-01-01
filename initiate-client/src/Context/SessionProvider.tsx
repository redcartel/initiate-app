
import { useEffect, useState } from "react";
import { SessionContext } from "./SessionContext";

export const SessionProvider = ({ children }: React.PropsWithChildren) => {
    const [sessionKey, setSessionKey] = useState('');
    const [errMsg, setErrMsg] = useState<string | null>(null);

    useEffect(() => {
        const sessionKey = localStorage.getItem('sessionKey');
        if (sessionKey) {
            setSessionKey(sessionKey);
        }
    }, []);

    useEffect(() => {
        if (sessionKey) {
            localStorage.setItem('sessionKey', sessionKey);
        }
    }, [sessionKey]);

    const clearSessionKey = () => {
        setSessionKey('');
        localStorage.removeItem('sessionKey');
    }

    return <SessionContext.Provider value={{ sessionKey, setSessionKey, clearSessionKey, errMsg, setErrMsg }}>{children}</SessionContext.Provider>;
}