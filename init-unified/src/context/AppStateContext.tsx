/* eslint-disable react-refresh/only-export-components */
import { createContext } from 'react';

// Define the base state type - extend this with your actual state properties
export interface AppState {
    // Add your state properties here
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
}

// Define the context type
export type AppStateContextType = {
    state: AppState;
    dispatch: (mutation: (currentState: AppState) => AppState) => void | AppState;
};

// Create the context
export const AppStateContext = createContext<AppStateContextType | undefined>(undefined);

// Initial state - customize this with your default values