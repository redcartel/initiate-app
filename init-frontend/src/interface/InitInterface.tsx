import { useParams } from "react-router-dom";
import GameInterface from "./GameInterface";
import NoCharacterInterface from "./NoCharacterInterface";
import { useEffect } from "react";
import NoGameInterface from "./NoGameInterface";

const InitInterface = () => {
    const { gameId, characterId } = useParams();

    useEffect(() => {
        if (gameId && characterId) {
            window.localStorage.setItem('gameId', gameId);
            window.localStorage.setItem('characterId', characterId);
        }
        else if (gameId) {
            window.localStorage.setItem('gameId', gameId);
            window.localStorage.removeItem('characterId');
        }
    }, [gameId, characterId])

    if (!gameId) {
        return <NoGameInterface />
    }

    if (!characterId) {
        return <NoCharacterInterface gameId={gameId!} />
    }

    return <GameInterface gameId={gameId!} characterId={characterId!} />
}

export default InitInterface;