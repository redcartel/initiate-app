
import { createContext } from "react";
import { SessionContextType } from "./SessionContextType";

export const SessionContext = createContext<SessionContextType>({
    sessionKey: '',
    errMsg: null,
    setErrMsg: () => { },
    setSessionKey: () => { },
    clearSessionKey: () => { },
});

export default SessionContext;
