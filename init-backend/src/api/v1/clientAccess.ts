import { RedisClientType } from 'redis';
import { Request, Response, Router } from 'express';
import { get } from '../services/store';
import { gameIdCharacterId } from '../services/auth';
import { createError } from '../../createError';
import { createListedCharacter } from '../data/clientCharacterList';

const getClientGame = (client: RedisClientType) => async (req: Request, res: Response) => {
    const { gameId, characterId } = gameIdCharacterId(req.headers.authorization ?? '');
    const game = await get(client)(`game-${gameId}`);
    if (!game) {
        throw createError(404);
    }
    res.json(game);
}

const getClientCharacter = (client: RedisClientType) => async (req: Request, res: Response) => {
    const { gameId, characterId } = gameIdCharacterId(req.headers.authorization ?? '');
    if (!gameId || !characterId) {
        console.log('no gameId or characterId');
        throw createError(404);
    }
    const game = await get(client)(`game-${gameId}`);
    if (!game) {
        console.log('no game');
        throw createError(404);
    }
    let character = await get(client)(`character-${gameId}-${characterId}`);
    if (!character) {
        console.log('no character... creating');
        await createListedCharacter(client)(gameId, characterId);
        character = await get(client)(`character-${gameId}-${characterId}`);
        console.log('character created', character);
        res.json(character);
    }
    else {
        res.json(character);
    }
}

const clientAccessRouter = (client: RedisClientType) => {
    const router = Router();
    router.get('/', getClientGame(client));
    router.get('/character', getClientCharacter(client));
    return router;
}

export { getClientGame, clientAccessRouter };