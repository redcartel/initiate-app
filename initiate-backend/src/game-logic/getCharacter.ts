import { gameState } from "..";
import { Character } from "../types"

export type KeyCharacter = {
    sessionKey: string | null,
    character: Character | null,  
}

export const getCharacterAndSessionKey = (characterKey: string) => {
    const unassignedChar = gameState.characters.unassigned.find(char => char.key === characterKey);
    if (unassignedChar) {
        return {
            sessionKey: null,
            character: unassignedChar
        }
    }
    const [sessionKey, assignedChar] = Object.entries(gameState.characters.assigned).find(([key, char]) => char.key === characterKey) || [null, null];
    if (assignedChar) {
        return {
            sessionKey,
            character: assignedChar
        }
    }
}

export const getCharacterFromSessionKey = (sessionKey: string) => {
    const assignedChar = gameState.characters.assigned[sessionKey];
    if (assignedChar) {
        return {
            sessionKey,
            character: assignedChar
        }
    }
    return {
        sessionKey: null,
        character: null
    }
}