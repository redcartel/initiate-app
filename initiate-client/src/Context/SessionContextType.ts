
export type SessionContextType = {
    sessionKey: string;
    setSessionKey: (sessionKey: string) => void;
    clearSessionKey: () => void;
}