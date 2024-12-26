import { useGameAndCharacter } from "../hooks/useGameAndCharacter";
import GameInterface from "./GameInterface";
import NoCharacterInterface from "./NoCharacterInterface";
import NoGameInterface from "./NoGameInterface";

const InitInterface = () => {
    const { characterId, gameId } = useGameAndCharacter();

    if (!gameId) {
        return <NoGameInterface />
    }

    if (!characterId) {
        return <NoCharacterInterface />
    }

    return <GameInterface />
}

export default InitInterface;