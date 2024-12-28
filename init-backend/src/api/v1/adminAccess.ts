import { RedisClientType } from "redis";
import { Request, Response, Router } from "express";
import { adminIdGameId } from "../services/auth";
import { gameList, setGame, removeGame as _removeGame, getGame as _getGame, gameListWithData, createAdmin as _createAdmin } from "../data/adminGameList";
import { generateId } from "../services/generateId";

export const getGameList = (client: RedisClientType) => async (req: Request, res: Response) => {
    const { adminId } = adminIdGameId(req.headers.authorization ?? '');



    if (adminId === process.env.ADMIN_KEY) {
        res.status(200).json({
            createAdmin: true
        });
        return;
    }

    res.status(200).json(await gameListWithData(client)(adminId));
}

export const addGame = (client: RedisClientType) => async (req: Request, res: Response) => {
    const { adminId } = adminIdGameId(req.headers.authorization ?? '');
    const game = req.body;
    const list = await gameList(client)(adminId);
    const gameId = generateId();
    await setGame(client)(adminId, gameId, game);
    res.status(200).json({
        id: gameId,
        ...game
    });
}

export const removeGame = (client: RedisClientType) => async (req: Request, res: Response) => {
    const { adminId, gameId } = adminIdGameId(req.headers.authorization ?? '');

    await _removeGame(client)(adminId, gameId);
    res.status(200).json({
        message: 'Game removed'
    });
}

export const getGame = (client: RedisClientType) => async (req: Request, res: Response) => {
    const { adminId, gameId } = adminIdGameId(req.headers.authorization ?? '');

    res.json(await _getGame(client)(adminId, gameId));
}

export const createAdmin = (client: RedisClientType) => async (req: Request, res: Response) => {
    const { adminId } = adminIdGameId(req.headers.authorization ?? '');

    const id = await _createAdmin(client)(adminId);

    res.status(200).json({
        'adminId': id
    });
}

export const adminAccessRouter = (redis: RedisClientType) => {
    const router = Router();
    router.get('/', getGameList(redis));
    router.post('/', addGame(redis));
    router.delete('/', removeGame(redis));
    router.post('/createAdmin', createAdmin(redis));
    return router;
}