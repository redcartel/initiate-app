import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import routes from './routes';
import { GetResponse, OrderContent } from '../../initiate-client/src/QueryTypes/getResponse';
import { Params, processGet } from './processGet';
import { processPost } from './processPost';
import { PostBody } from '../../initiate-client/src/QueryTypes/postBody';
import { GameState } from './types';
import { specialKeys } from './consts';
import { createClient } from 'redis';
import { sendHtml } from './processGet/getHtml';

const reactionOrderOptions : OrderContent = {
    type: 'select',
    title: 'Reaction',
    description: 'Choose a reaction',
    key: 'reaction',
    options: [{
            label: 'Opportunity Attack',
            key: 'opportunityAttack',
            description: 'Take first opportunity attack',
            value: 'opportunityAttack'
        },
        {
            label: 'Ready Action',
            description: 'Ready an action',
            key: 'readyAction',
            value: specialKeys.reactionReadyAction,
            followUp: {
                type: 'textarea',
                title: 'Describe Condition',
                description: 'Describe the condition that triggers your action',
                key: 'readyActionCondition',
                followUp: {
                    type: 'textarea',
                    title: 'Describe Action',
                    description: 'Describe the action you are readying',
                    key: 'readyActionAction'
                }
            }
        },
        {
            label: 'Other Reaction',
            key: 'otherReaction',
            value: 'otherReaction',
            followUp: {
                type: 'textarea',
                title: 'Describe Reaction',
                description: 'Describe the reaction you are taking, if you specify more than one reaction, the first one triggered will be used.',
                key: 'otherReactionDescription'
            }
        }
    ]
}

const moveOrderOptions : OrderContent = {
    type: 'select',
    title: 'Act Immediately',
    key: 'move1',
    description: 'Act immediately or move prior to non-immediate action?',
    options: [
        {
            label: 'Act Immediately',
            key: 'actImmediately',
            value: 'actImmediately'
        },
        {
            label: 'Move Prior to Non-Immediate Action',
            key: 'movePriorToNonImmediateAction',
            value: 'movePriorToNonImmediateAction',
            followUp: {
                type: 'textarea',
                title: 'Describe Movement',
                description: 'Describe the movement you are taking',
                key: 'movePriorToNonImmediateActionMovement'
            }
        }
    ]
}

const actionOrderOptions : OrderContent = {
    type: 'textarea',
    title: 'Action',
    description: 'Describe your action',
    key: 'action',
    followUp: {
        type: 'select',
        title: 'Bonus Action',
        key: 'bonusAction',
        description: 'Use a bonus action?',
        options: [
            {
                label: 'Yes',
                key: 'yes',
                value: 'yes',
                followUp: {
                    type: 'textarea',
                    title: 'Describe Bonus Action',
                    description: 'Describe your bonus action',
                    key: 'bonusActionDescription'
                }
            },
            {
                label: 'No',
                key: 'no',
                value: 'no'
            }
        ]
    }
}

const move2OrderOptions : OrderContent = {
    type: 'select',
    title: 'Move 2',
    description: 'Move after action?',
    key: 'move2',
    options: [
        {
            label: 'Yes',
            key: 'yes',
            value: 'yes',
            followUp: {
                type: 'textarea',
                title: 'Describe Movement',
                description: 'Describe the movement you are taking',
                key: 'move2Movement'
            }
        },
        {
            label: 'No',
            key: 'no',
            value: 'no'
        }
    ]
}

const reviewOrderOptions : OrderContent = {
    type: 'auto',
    key: '__review__'
}


export const defaultGameState: GameState = {
    name: 'Capture the Flag v4',
    turn: 0,
    turnOpen: true,
    turnOrderLists: {},
    active: false,
    characters: {
        unassigned: [
            {
                name: 'Player 1',
                key: 'player1',
                orderOptions: {
                    reaction: reactionOrderOptions,
                    move1: moveOrderOptions,
                    action: actionOrderOptions,
                    move2: move2OrderOptions,
                    review: reviewOrderOptions
                }
            },
            {
                name: 'Player 2',
                key: 'player2',
                orderOptions: {
                    reaction: reactionOrderOptions,
                    move1: moveOrderOptions,
                    action: actionOrderOptions,
                    move2: move2OrderOptions,
                    review: reviewOrderOptions
                }
            },
            {
                name: 'Player 3',
                key: 'player3',
                orderOptions: {
                    reaction: reactionOrderOptions,
                    move1: moveOrderOptions,
                    action: actionOrderOptions,
                    move2: move2OrderOptions,
                    review: reviewOrderOptions
                }
            }
        ],
        assigned: {}
    },
    turnPhaseOrder: [
        'reaction',
        'move1',
        'action',
        'move2',
        'review'
    ],
    turnAnswers: {

    },
    turnSelections: {

    }
}

export let gameState: GameState = defaultGameState;

export function resetGameState() {
    gameState = defaultGameState;
}

export function setGameState(newGameState: GameState) {
    gameState = newGameState;
}

export const redisClient = createClient({ url: process.env.REDIS_URL });
redisClient.connect();

const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(helmet());
app.use(morgan('common'));

app.use('/html/*', (req: Request, res: Response) => {
    console.log(req.baseUrl);
    let path = req.baseUrl.startsWith('/') ? req.baseUrl.slice(1) : req.baseUrl;
    sendHtml(path, res);
});

app.use('/api/v1', async (req: Request, res: Response) => {
    if (req.method === 'GET') {
        const data = await processGet(req.query as Params);
        console.log('get returns ', data);
        try {
            await redisClient.set('gameState', JSON.stringify(gameState));
        } catch (error) {
            console.error('Error setting gameState in redis', error);
        }
        res.status(200).json(data);
    } else if (req.method === 'POST') {
        const data = await processPost(req.body as PostBody, req.query as Params);
        console.log('post returns ', data);
        console.log('gameState answers', gameState.turnAnswers);
        console.log('gameState selections', gameState.turnSelections);
        try {
            await redisClient.set('gameState', JSON.stringify(gameState));
        } catch (error) {
            console.error('Error setting gameState in redis', error);
        }
        res.status(200).json(data);
    } else {
        res.status(405).send('Method Not Allowed');
    }
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err);
    res.status(500).send('Internal Server Error');
});

export { app }
