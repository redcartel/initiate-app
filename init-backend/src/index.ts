import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import routes from './routes';
import { ErrorResponse } from './types';

const app = express();

app.use(cors({ origin: '*' }));
app.use(helmet());
app.use(express.json());
app.use(morgan('combined'));

app.use('/', routes);

app.use((err: ErrorResponse, req: Request, res: Response, next: Function) => {
    console.error(err.stack);
    res.status(err.status ?? 500).json({ errorMsg: err.message ?? 'Internal Server Error' });
});

app.listen(parseInt(process.env.PORT ?? '4040'), () => {
    console.log(JSON.stringify({
        app: app,
        message: 'Server is running on port ' + app.get('port'),
    }, null, 2));
});