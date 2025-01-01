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

const reactionOrderOptions : OrderContent = {
    type: 'select',
    title: 'Reaction',
    description: 'Choose a reaction',
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
            value: 'readyAction',
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
        }
    ]
}

const moveOrderOptions : OrderContent = {
    type: 'select',
    title: 'Act Immediately',
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
    type: 'textarea',
    title: 'Final Notes',
    description: 'Any final notes?',
    key: 'finalNotes',
    followUp: {
        type: 'info',
        title: 'Review your orders',
        description: '__getOrders()__',
        key: 'reviewOrders',
        linkButtons: [
            {
                label: 'Submit',
                href: '/turn/submit',
                theme: 'action'
            }
        ]
    }
}


export const gameState: GameState = {
    name: 'Capture the Flag v4',
    turn: 0,
    turnOrderLists: {},
    characters: {
        unassigned: [
            {
                name: 'Player 1',
                key: 'player1',
                orderOptions: {
                    reaction: reactionOrderOptions,
                    move: moveOrderOptions,
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
                    move: moveOrderOptions,
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
                    move: moveOrderOptions,
                    action: actionOrderOptions,
                    move2: move2OrderOptions,
                    review: reviewOrderOptions
                }
            }
        ],
        assigned: {}
    }
}

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