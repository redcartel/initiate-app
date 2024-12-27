import { Router } from 'express';
import { createError } from '../../createError';
import { orderOptions } from '../data/orderOptions';
import { client } from '../../redisClient';
import { orderOptionsRouter } from './orderOptions';

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
        },
    });
});

router.use('/orderOptions', orderOptionsRouter(client));

export default router;