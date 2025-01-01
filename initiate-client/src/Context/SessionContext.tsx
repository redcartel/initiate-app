
import { createContext } from "react";
import { SessionContextType } from "./SessionContextType";

export const SessionContext = createContext<SessionContextType>({
    sessionKey: '',
    setSessionKey: () => { },
    clearSessionKey: () => { },
});

export default SessionContext;