import { ReactNode, useCallback, useState } from "react";
import { AppState, AppStateContext } from "./AppStateContext";
import { initialState as _initialState } from "./initialState";

/**
 * Provider component
 * @param children - ReactNode
 * @returns 
 */
export function AppStateProvider({ children }: { children: ReactNode, initialState?: AppState }) {
    const [state, setState] = useState<AppState>(_initialState);

    // Dispatch calls a mutation function or accepts a new state object
    const dispatch = useCallback((mutation: (currentState: AppState) => AppState) => {
        console.log('dispatch');
        if (typeof mutation === 'function') {
            const newState = mutation(state);
            console.log('newState', newState);
            setState(newState);
        } else {
            setState(mutation);
        }
    }, []);

    return (
        <AppStateContext.Provider value={{ state, dispatch }}>
            {children}
        </AppStateContext.Provider>
    );
}