import { createError } from "../../createError";

export const gameIdCharacterId = (authorization: string) => {
    if (!authorization || !/Bearer .+:.+/i.test(authorization)) {
        throw createError(401);
    }
    const [gameId, characterId] = authorization.slice(7).split(':');
    return { gameId, characterId };
}