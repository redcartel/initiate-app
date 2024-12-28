import { Router } from 'express';
import { client } from '../../redisClient';
import { adminAccessRouter } from './adminAccess';
import { adminGameRouter } from './adminGame';
import { clientAccessRouter } from './clientAccess';

const router = Router();

router.get('/', (req, res) => {
    res.send({
        version: '0.0.1',
        name: 'init-backend',
        description: 'Init Backend',
        author: 'Creation Games',
        license: 'GPL-3.0',
        repository: 'https://github.com/CreationGames/init-backend',
        endpoints: {
            '/': {
                get: {
                    description: 'This endpoint is used to check if the server is running',
                },
            },
            '/orderOptions': {
                get: {
                    description: 'This endpoint is used to get the order options for a character',
                },
            },
            '/clientAccess': {
                get: {
                    description: 'This endpoint is used to get the game for a client',
                },
            },
        },
    });
});
router.use('/adminAccess', adminAccessRouter(client));
router.use('/adminGame', adminGameRouter(client));
router.use('/clientAccess', clientAccessRouter(client));
export default router;