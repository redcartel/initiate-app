import { createError } from "../../createError";

export const gameIdCharacterId = (authorization: string) => {
    console.log(authorization);

    if (!authorization || !/Bearer .+:.*/i.test(authorization)) {
        throw createError(401);
    }
    const [gameId, characterId] = authorization.slice(7).split(':');
    return { gameId, characterId };
}

export const adminIdGameId = (authorization: string) => {


    if (!authorization || !/Bearer .+:.*/i.test(authorization)) {
        throw createError(401);
    }



    const [adminId, gameId] = authorization.slice(7).split(':');




    return { adminId, gameId };
}