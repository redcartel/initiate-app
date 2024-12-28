import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import nocache from 'nocache';
import dotenv from 'dotenv';
import routes from './src/routes';
import { ErrorResponse } from './src/types';
import { createError } from './src/createError';

dotenv.config();

const app = express();

app.use(cors({ origin: '*' }));
app.use(helmet());
app.use(express.json());
app.use(morgan('common'));
app.use(nocache());
app.use('/', routes);

app.use((_req: Request, _res: Response, _next: Function) => {
    throw createError(404);
});

app.use((err: ErrorResponse, _req: Request, res: Response, _next: Function) => {
    console.error('🚨🚨=== express error ===🚨🚨');
    console.error(err.stack);
    res.status(err.status ?? 500).json({ errorMsg: err.message ?? 'Internal Server Error' });
    _next();
});

const port = parseInt(process.env.PORT ?? '4040');

app.listen(port, () => {
    console.log(`🚀🚀 Server is running on port ${port} 🚀🚀`);
}).on('error', (err: Error) => {
    console.error(err);
    process.exit(1);
});
