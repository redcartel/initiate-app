import { useEffect } from "react";
import { useState } from "react";
import useFakeGetter from "./useFakeGetter";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type CharacterSheet = any | null;

const memory: {
    characterSheet: CharacterSheet,
    characterDescription: string | null
} = {
    characterSheet: null,
    characterDescription: null
}

const useCharacterSheet = (gameId: string, characterId: string) => {
    const [characterSheet, setCharacterSheet] = useState<CharacterSheet | null>(null);
    const [characterDescription, setCharacterDescription] = useState<string | null>(null);
    const get = useFakeGetter("/api/v1/character-sheets");

    useEffect(() => {
        const _characterSheet = memory.characterSheet;
        const _characterDescription = memory.characterDescription;

        if (_characterSheet) {
            setCharacterSheet(_characterSheet);
            if (_characterDescription) {
                setCharacterDescription(_characterDescription);
            }
        } else {
            get({ params: { gameId, characterId } }).then(({ characterSheet, characterDescription }: { characterSheet: CharacterSheet, characterDescription: string | null }) => {
                setCharacterSheet(characterSheet);
                setCharacterDescription(characterDescription);
            });
        }
    }, [gameId, characterId, get]);

    return { characterSheet, characterDescription };
}

export default useCharacterSheet;