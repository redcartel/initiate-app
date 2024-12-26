import { useCallback } from "react";

const useConfirmGame = () => {
    const confirmGame = useCallback(async (gameId: string, characterId: string | null) => {
        if (gameId === 'abc' && characterId === '123') {
            return true;
        }
        else if (gameId === 'abc' && characterId === null) {
            return true;
        }
        return false;
    }, []);

    return confirmGame;
}

export default useConfirmGame;