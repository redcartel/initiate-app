import { RedisClientType } from "redis";
import { getGame, setGame } from "./adminGameList";
import { createError } from "../../createError";

export const getCharacters = (client: RedisClientType) => async (adminId: string, gameId: string) => {
    const game = await getGame(client)(adminId, gameId);
    return game.characters;
}

export const getCharacter = (client: RedisClientType) => async (adminId: string, gameId: string, characterId: string) => {
    const game = await getGame(client)(adminId, gameId);
    const character = game.characters.find((character: any) => character.id === characterId);
    if (!character) {
        throw createError(404);
    }
    return character;
}

export const setCharacter = (client: RedisClientType) => async (adminId: string, gameId: string, characterId: string, character: any, replace: boolean = false) => {
    const game = await getGame(client)(adminId, gameId);

    let found = false;

    game.characters.forEach((character: any, index: number) => {
        if (character.id === characterId) {
            if (replace) {
                game.characters[index] = { ...character, id: characterId };
            } else {
                game.characters[index] = { ...game.characters[index], ...character };
            }
            found = true;
        }
    });

    if (!found) {
        throw createError(404);
    }

    await setGame(client)(adminId, gameId, game);
}