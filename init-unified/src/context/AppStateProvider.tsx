import { ReactNode, useCallback, useEffect, useState } from "react";
import { AppState, AppStateContext } from "./AppStateContext";

/**
 * Provider component
 * @param children - ReactNode
 * @returns 
 */
export function AppStateProvider({ children }: { children: ReactNode, initialState?: AppState }) {
    const [state, setState] = useState<AppState>({});

    // Expose the state to the window object
    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).state = function () {
            return state;
        }
    }, [state]);

    // Dispatch calls a mutation function or accepts a new state object
    const dispatch = useCallback((mutation: (currentState: AppState) => AppState) => {

        if (typeof mutation === 'function') {
            const newState = mutation(state);

            setState(newState);
        } else {

            setState(mutation);
        }
    }, [state]);

    return (
        <AppStateContext.Provider value={{ state, dispatch }}>
            {children}
        </AppStateContext.Provider>
    );
}