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
import { createClient } from 'redis';
import { sendHtml } from './processGet/getHtml';
import { specialKeys } from './consts';
import { ThemeOption } from '../../initiate-client/src/types';

export const apiBase = process.env.API_BASE ?? 'https://api.d20init.com';

const reactionOrderOptions: OrderContent = {
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
        key: specialKeys.reactionReadyAction,
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

const moveOrderOptions: OrderContent = {
    type: 'select',
    title: 'Act Immediately',
    key: 'move1',
    description: 'Act immediately or move prior to non-immediate action?',
    options: [
        {
            label: 'Act Immediately',
            key: specialKeys.actImmediately,
            value: specialKeys.actImmediately
        },
        {
            label: 'Move prior to action',
            key: specialKeys.moveEarly,
            value: specialKeys.moveEarly,
            followUp: {
                type: 'textarea',
                title: 'Describe Movement',
                description: 'Describe the movement you are taking',
                key: 'movePriorToNonImmediateActionMovement'
            }
        }
    ],
    htmlLink: apiBase + '/html/move1/index.html'
}

const actionOrderOptions: OrderContent = {
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

const move2OrderOptions: OrderContent = {
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

const reviewOrderOptions: OrderContent = {
    type: 'auto',
    key: specialKeys.reviewOrderPage
}

export const phaseSelect = [
    { label: 'React', href: '/client/turn/reaction', theme: 'secondary' },
    { label: 'Move', href: '/client/turn/move1', theme: 'secondary' },
    { label: 'Act', href: '/client/turn/action', theme: 'secondary' },
    { label: 'Move', href: '/client/turn/move2', theme: 'secondary' },
    { label: 'Review', href: `/client/turn/${specialKeys.reviewOrderPage}`, theme: 'action' }
] as { label: string, href: string, theme?: ThemeOption }[]

export const adminPhaseSelectPlay = [
    { label: 'React', href: '/admin/play/reaction', theme: 'secondary' as ThemeOption },
    { label: 'Act', href: '/admin/play/action1', theme: 'secondary' as ThemeOption },
    { label: 'Move', href: '/admin/play/move1', theme: 'secondary' as ThemeOption },
    { label: 'Act', href: '/admin/play/action2', theme: 'secondary' as ThemeOption },
    { label: 'Move', href: '/admin/play/move2', theme: 'secondary' as ThemeOption },
]

export const adminPhaseSelectTurn = [
    { label: 'React', href: '/admin/turn/reaction', theme: 'secondary' as ThemeOption },
    { label: 'Move', href: '/admin/turn/move1', theme: 'secondary' as ThemeOption },
    { label: 'Act', href: '/admin/turn/action', theme: 'secondary' as ThemeOption },
    { label: 'Move', href: '/admin/turn/move2', theme: 'secondary' as ThemeOption },
    { label: 'Review', href: `/admin/turn/${specialKeys.reviewOrderPage}`, theme: 'action' as ThemeOption }
]

export const adminModeSelect = [
    { label: 'Manage', href: '/admin/adjudicate', theme: 'primary' as ThemeOption },
    { label: 'Orders', href: '/admin/turn/reaction', theme: 'primary' as ThemeOption },
    { label: 'NPCs', href: '/admin/npc', theme: 'primary' as ThemeOption },
    { label: 'Play', href: '/admin/play/reaction', theme: 'primary' as ThemeOption },
]

export const defaultGameState: GameState = {
    name: 'Capture the Flag v4',
    turn: 0,
    turnOpen: true,
    turnOrderLists: {},
    active: false,
    adminKeyGroups: [],
    keyGroups: [],
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
                },
                htmlLink: apiBase + '/html/index.html'
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
                },
                htmlLink: apiBase + '/html/index.html'
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
                },
                htmlLink: apiBase + '/html/index.html'
            },
            {
                name: 'Stone Giant Cleric',
                key: 'stoneGiantCleric',
                orderOptions: {
                    reaction: reactionOrderOptions,
                    move1: moveOrderOptions,
                    action: actionOrderOptions,
                    move2: move2OrderOptions,
                    review: reviewOrderOptions
                },
                htmlLink: apiBase + '/html/index.html',
                npcOnly: true
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

    },
    adminState: {
        playState: {
            dropDownChecked: {
                reaction: [],
                action1: [],
                move1: [],
                action2: [],
                move2: []
            }
        }
    }
}

export let gameState: GameState;


export const redisClient = createClient({ url: process.env.REDIS_URL ?? 'redis://localhost:6379' });
redisClient.connect();

export async function resetGameState() {
    const retrievedGameState = await redisClient.get('gameState');
    if (retrievedGameState) {
        console.log('state retrieved from redis');
        gameState = JSON.parse(retrievedGameState);
    }
    else {
        console.log('no state in redis, using default');
        gameState = defaultGameState;
    }
}

export async function setGameState(newGameState: GameState) {
    await redisClient.set('gameState', JSON.stringify(newGameState));
    gameState = newGameState;
}

const app = express();

app.use(cors());
app.use(express.json());
app.use(helmet({
    frameguard: false
}));
app.use(morgan('common'));
app.disable('etag');

app.use('/html/*', (req: Request, res: Response) => {
    console.log('html for', req.baseUrl);
    let path = req.baseUrl.startsWith('/') ? req.baseUrl.slice(1) : req.baseUrl;
    res.setHeader('Content-Security-Policy', "default-src 'self'; frame-ancestors " + (process.env.CLIENT_URL ?? 'https://d20init.com'));
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('X-Frame-Options', 'ALLOW-FROM ' + (process.env.CLIENT_URL ?? 'https://d20init.com'));
    res.status(200);
    sendHtml(path, res);
});

app.use('/api/v1/reset', async (req: Request, res: Response) => {
    if (req.method === 'POST') {
        if (req.body.gameKey.toLowerCase().split(/[ -]/).join('-') === 'reset-tactics-game') {
            gameState = defaultGameState;
            res.status(201).json({ message: 'Game state reset' });
        } else {
            res.status(405).send('Method Not Allowed');
        }
    } else {
        res.status(405).send('Method Not Allowed');
    }
});

app.use('/api/v1', async (req: Request, res: Response) => {
    console.log('api/v1', req.method, req.baseUrl);
    if (req.method === 'GET') {
        await resetGameState();
        console.log('gameState = ', gameState);
        const data = await processGet(req.query as Params);
        if (!(data.content.type === 'select' && data.content.poll === true)) {
            try {
                console.log('get returns ', data);
                await redisClient.set('gameState', JSON.stringify(gameState));
            } catch (error) {
                console.error('Error setting gameState in redis', error);
            }
        }
        setGameState(gameState!);
        res.status(200).json(data);
    } else if (req.method === 'POST') {
        await resetGameState();
        const data = await processPost(req.body as PostBody, req.query as Params);
        console.log('post returns ', data);
        try {
            await redisClient.set('gameState', JSON.stringify(gameState));
        } catch (error) {
            console.error('Error setting gameState in redis', error);
        }
        await setGameState(gameState!);
        console.log('gameState set to', gameState);
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
