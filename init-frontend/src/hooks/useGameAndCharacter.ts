import { useParams } from "react-router";
import { useAppState } from "./useAppState";
import { useCallback, useEffect } from "react";
import { AppState } from "../context/AppStateContext";

export const useGameAndCharacter = () => {
    const params = useParams();
    const { state, dispatch } = useAppState();

    const gameId = params.gameid || state.gameId || null;
    const characterId = gameId ? params.characterid || state.characterId || null : null;
    const sessionId = window.sessionStorage.getItem('sessionId') || crypto.randomUUID();
    const playerId = window.localStorage.getItem('playerId') || crypto.randomUUID();

    dispatch((state: AppState) => {
        state.gameId = gameId;
        state.characterId = characterId;
        state.sessionId = sessionId;
        state.playerId = playerId;
        window.sessionStorage.setItem('sessionId', sessionId);
        window.localStorage.setItem('playerId', playerId);
        return state;
    });

    useEffect(() => {
        console.log('state', state);
        if (state.gameId && state.characterId) {
            if (!window.location.pathname.includes(state.gameId) || !window.location.pathname.includes(state.characterId)) {
                window.location.href = `/${state.gameId}/${state.characterId}`;
            }
        }
        else if (state.gameId) {
            if (!window.location.pathname.includes(state.gameId)) {
                window.location.href = `/${state.gameId}`;
            }
        }
        else {
            if (!/^\/$/.test(window.location.pathname)) {
                window.location.href = '/';
            }
        }
    }, [state]);

    const setGameId = useCallback((gameId: string) => {
        console.log('setGameId', gameId);
        dispatch((state: AppState) => {
            console.log('setGameId', state, gameId);
            state.gameId = gameId;
            return state;
        });
    }, [dispatch]);

    const setCharacterId = useCallback((characterId: string) => {
        dispatch((state: AppState) => {
            console.log('setCharacterId', state, characterId);
            state.characterId = characterId;
            return state;
        });
    }, [dispatch]);

    const resetGameAndCharacter = useCallback(() => {
        dispatch((state: AppState) => {
            console.log('resetGameAndCharacter', state);
            state.gameId = null;
            state.characterId = null;
            return state;
        });
    }, [dispatch]);

    return { gameId, characterId, setGameId, setCharacterId, resetGameAndCharacter };
}