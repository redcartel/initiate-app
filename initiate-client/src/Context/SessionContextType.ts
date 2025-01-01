
export type SessionContextType = {
    sessionKey: string;
    errMsg: string | null;
    setErrMsg: (errMsg: string | null) => void;
    setSessionKey: (sessionKey: string) => void;
    clearSessionKey: () => void;
}