import { RedisClientType } from "redis";
import { createError } from "../../createError";
import { get, set } from "../services/store";

export const createListedCharacter = (client: RedisClientType) => async (gameId: string, characterId: string) => {
    const game = await get(client)(`game-${gameId}`);
    if (!game) {
        throw createError(404);
    }
    if (!game.characterList) {
        throw createError(404);
    }
    const character = game.characterList.find((character: any) => character.id === characterId);

    if (!characterId) {
        throw createError(404);
    }

    const _character = await get(client)(`character-${gameId}-${characterId}`);
    if (_character) {
        return true;
    }
    else {
        await set(client)(`character-${gameId}-${characterId}`, character);
        return true;
    }
}