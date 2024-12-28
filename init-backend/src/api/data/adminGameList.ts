import { RedisClientType } from "redis";
import { createError } from "../../createError";
import { generateId } from "../services/generateId";
import { get, set } from "../services/store";
import { getGameTemplateList } from "../services/yamlAccess";

const gameList = (client: RedisClientType) => async (adminId: string) => {
    const key = `${adminId}:game-list`;
    const listString = `${await get(client)(key)}`;
    if (listString === 'null') {

        throw createError(401);
    }
    else if (`${listString}` === '') {

        return [];
    }
    return listString.split(',');
}

const gameListWithData = (client: RedisClientType) => async (adminId: string) => {
    const list = await gameList(client)(adminId);
    const dataList = await Promise.all(list.map((gameId: string) => getGame(client)(adminId, gameId)));
    const data = dataList.reduce((acc, game, index) => {
        acc[list[index]] = game;
        return acc;
    }, {} as any);

    return data;
}

const addGame = (client: RedisClientType) => async (adminId: string, gameId: string) => {
    const list = await gameList(client)(adminId);
    list.push(gameId);
    await client.set(`${adminId}:game-list`, list.join(','), { EX: 60 * 60 * 24 * 7 });
}

const removeGame = (client: RedisClientType) => async (adminId: string, gameId: string) => {
    const list = await gameList(client)(adminId);
    list.splice(list.indexOf(gameId), 1);
    await client.set(`${adminId}:game-list`, list.join(','), { EX: 60 * 60 * 24 * 7 });
}

const getGame = (client: RedisClientType) => async (adminId: string, gameId: string) => {
    const _list = await gameList(client)(adminId);
    const game = await get(client)(`game-${gameId}`);
    if (game) {
        return JSON.parse(game) as any;
    }
    throw createError(404);
}

const setGame = (client: RedisClientType) => async (adminId: string, gameId: string, game: any) => {
    const list = await gameList(client)(adminId);
    const gameString = JSON.stringify(game);
    if (!list.includes(gameId)) {
        list.push(gameId);
    }
    await set(client)(`game-${gameId}`, gameString, 60 * 60 * 24 * 7);
    await set(client)(`${adminId}:game-list`, list.join(','), 60 * 60 * 24 * 7);
}

const createAdmin = (client: RedisClientType) => async (adminId: string) => {
    if (adminId !== process.env.ADMIN_KEY) {
        throw createError(401);
    }

    const id = generateId();

    const key = `${id}:game-list`;

    await client.set(key, '', { EX: 60 * 60 * 24 * 7 });



    return id;
}

const getTemplates = (client: RedisClientType) => async (adminId: string) => {
    const templates = getGameTemplateList();
    return templates;
}

export { gameList, gameListWithData, addGame, removeGame, getGame, setGame, createAdmin, getTemplates }
