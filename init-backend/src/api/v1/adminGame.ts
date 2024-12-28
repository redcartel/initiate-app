
import { Request, Response, Router } from "express";
import { adminIdGameId } from "../services/auth";
import { getGame as _getGame, gameList, setGame as _setGame } from "../data/adminGameList";
import { RedisClientType } from "redis";
import { getGameTemplate, getGameTemplateList } from "../services/yamlAccess";
import { applyTemplate } from "../services/gameTemplates";

export const getGame = (client: RedisClientType) => async (req: Request, res: Response) => {
    const { adminId, gameId } = adminIdGameId(req.headers.authorization ?? '');

    res.json(await _getGame(client)(adminId, gameId));
}

export const setGame = (client: RedisClientType) => async (req: Request, res: Response) => {
    const { adminId, gameId } = adminIdGameId(req.headers.authorization ?? '');
    const game = req.body;
    await _setGame(client)(adminId, gameId, game);
    res.status(200).json({
        message: 'Game set'
    });
}

export const gameTemplateList = (client: RedisClientType) => async (req: Request, res: Response) => {
    const { adminId } = adminIdGameId(req.headers.authorization ?? '');
    const _list = await gameList(client)(adminId);
    const templateList = getGameTemplateList();
    res.json({
        templates: templateList
    })
}

export const assignGameTemplate = (client: RedisClientType) => async (req: Request, res: Response) => {
    const { adminId, gameId } = adminIdGameId(req.headers.authorization ?? '');
    const _game = await _getGame(client)(adminId, gameId);
    const list = getGameTemplateList();
    if (!list.includes(req.body.template)) {
        res.status(400).json({
            message: 'Invalid template'
        });
        return;
    }

    const game = applyTemplate(req.body.template);

    await _setGame(client)(adminId, gameId, game);
    res.status(200).json({
        message: 'Game template assigned'
    });
}

export const adminGameRouter = (client: RedisClientType) => {
    const router = Router();
    router.get('/', getGame(client));
    router.post('/', setGame(client));
    router.get('/templateList', gameTemplateList(client));
    router.put('/setTemplate', assignGameTemplate(client));
    return router;
}