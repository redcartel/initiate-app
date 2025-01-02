
import { useEffect, useState } from "react";
import { SessionContext } from "./SessionContext";

export const SessionProvider = ({ children }: React.PropsWithChildren) => {
    const [sessionKey, setSessionKey] = useState('');
    const [errMsg, setErrMsg] = useState<string | null>(null);

    useEffect(() => {
        const localSessionKey = localStorage.getItem('sessionKey');
        if (localSessionKey && localSessionKey !== sessionKey) {
            setSessionKey(localSessionKey);
        }
    }, [sessionKey]);

    useEffect(() => {
        if (sessionKey) {
            localStorage.setItem('sessionKey', sessionKey);
        }
    }, [sessionKey]);

    const clearSessionKey = () => {
        localStorage.removeItem('sessionKey');
        setSessionKey('');
    }

    return <SessionContext.Provider value={{ sessionKey, setSessionKey, clearSessionKey, errMsg, setErrMsg }}>{children}</SessionContext.Provider>;
}