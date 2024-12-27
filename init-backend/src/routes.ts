import { Router } from 'express';
import apiV1Router from './api/v1';

const router = Router();

router.get('/', (req, res) => {
    res.redirect('/api/v1');
});

router.use('/api/v1', apiV1Router);

export default router;
