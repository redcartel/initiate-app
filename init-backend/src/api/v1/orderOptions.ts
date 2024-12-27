import { Request, Response, Router } from "express";
import { createError } from "../../createError";
import { RedisClientType } from "redis";
import { orderOptions } from "../data/orderOptions";
import { gameIdCharacterId } from "../services/auth";

export const getOrderOptions = (redis: RedisClientType) => async (req: Request, res: Response) => {
    if (!req.method || req.method !== 'GET') {
        throw createError(405);
    }

    const { gameId, characterId } = gameIdCharacterId(req.headers?.authorization ?? '');

    const options = await orderOptions(redis)(gameId, characterId);
    res.send(options);
}

export const orderOptionsRouter = (redis: RedisClientType) => {
    const router = Router();
    router.get('/', getOrderOptions(redis));
    return router;
}