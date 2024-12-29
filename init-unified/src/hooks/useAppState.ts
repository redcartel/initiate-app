import { useContext } from "react";
import { AppStateContext } from "../context/AppStateContext";

/**
 * Provides the context with the state and transform function
 * 
 */
export function useAppState() {
    const context = useContext(AppStateContext);
    if (context === undefined) {
        throw new Error('useAppState must be used within an AppStateProvider');
    }
    return context;
}