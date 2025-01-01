import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import routes from './routes';
import { GetResponse } from '../../initiate-client/src/QueryTypes/getResponse';
import { Params, processGet } from './processGet';
import { processPost } from './processPost';
import { PostBody } from '../../initiate-client/src/QueryTypes/postBody';


const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(helmet());
app.use(morgan('common'));

app.use('/api/v1', (req: Request, res: Response) => {
    if (req.method === 'GET') {
        res.status(200).json(processGet(req.query as Params));
    } else if (req.method === 'POST') {
        res.status(200).json(processPost(req.body as PostBody, req.query as Params));
    } else {
        res.status(405).send('Method Not Allowed');
    }
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err);
    res.status(500).send('Internal Server Error');
});

app.listen(3031, () => {
    console.log('🚀 Server is running on port 3031');
});