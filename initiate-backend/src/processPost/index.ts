import { PostBody } from "../../../initiate-client/src/QueryTypes/postBody";
import { PostResponse } from "../../../initiate-client/src/QueryTypes/postResponse";
import { Params } from "../processGet";
import crypto from 'crypto';
import { gameState, redisClient, setGameState } from "../index";
import { getNextRouteFromLeaf, getPathOrder } from "../game-logic/getPathOrder";
import { specialKeys } from "../consts";
import { postAdminAdj } from "./admin/postAdminAdj";

export async function processPost(body: PostBody, params: Params): Promise<PostResponse> {
    if (!gameState.active) {
        if (redisClient?.isReady) {
            const gameStateStore = await redisClient.get('gameState');
            if (gameStateStore) {
                setGameState(JSON.parse(gameStateStore));
            }
        }
    }
    
    console.log('processPost', body, params);
    const path = decodeURIComponent(params.path);
    const sessionKey = decodeURIComponent(params.sessionKey);
    const currentChar = gameState.characters.assigned[sessionKey];

    console.log('path', path);

    if (path === 'basic' || path === '') {
        return {
            '!redirect': '/basic/join'
        }
    }

    if (path === 'basic/game-create') {
        if (body.value === process.env.ADMIN_KEY) {
            const sessionKey = crypto.randomUUID();
            gameState.adminKey = sessionKey;
            console.log('setting adminsession key', sessionKey);

            return {
                '!newSessionKey': sessionKey,
                '!redirect': '/admin/adjudicate'
            }
        }
        else {
            return {
                '!errorMsg': 'Invalid admin invite key'
            }
        }
    }

    if (path === 'basic/join' && !sessionKey) {
        if (body.value === process.env.GAME_KEY) {
            const sessionKey = crypto.randomUUID();
            console.log('setting session key', sessionKey);

            return {
                '!newSessionKey': crypto.randomUUID(),
                '!redirect': '/basic/character'
            }
        }
        else {
            console.log('Invalid game code');
            console.log(body.value, '!=', process.env.GAME_KEY);
            return {
                '!errorMsg': 'Invalid game code'
            }
        }
    } else if (path === 'basic/join' && sessionKey) {
        return {
            '!redirect': '/basic/character'
        }
    }

    if (path === 'basic/character') {
        console.log('seek char', gameState.characters.unassigned.map(c => c.key));
        const char = gameState.characters.unassigned.find(c => c.key === body.value);
        console.log('char', char?.key);
        console.log('current char', currentChar?.key);
        if (char && !currentChar) {
            console.log('setting character ', char.key, ' for session', sessionKey);
            gameState.characters.unassigned = gameState.characters.unassigned.filter(c => c.key !== char.key);
            gameState.characters.assigned[sessionKey] = char;
            gameState.active = true;
            return {
                '!redirect': '/client/turn/' + gameState.turnPhaseOrder[0]
            }
        }
        else if (!char && currentChar) {
            return {
                '!errorMsg': 'Character already assigned'
            }
        }
        else {
            return {
                '!errorMsg': 'Character already assigned'
            }
        }
    }

    if (path === 'basic/bio') {
        return {
            '!redirect': '/client/turn'
        }
    }

    const pathSegments = path.split('/');

    console.log('path segments:', pathSegments);

    if (pathSegments.length > 2 && pathSegments[1] === 'turn') {
        console.log('post turn');
        console.log('pathSegments', pathSegments);
        console.log('body value', body.value);

        if (pathSegments.length === 3 && pathSegments[2] === specialKeys.reviewOrderPage) {
            console.log('review order page');


            gameState.turnAnswers[sessionKey] = {
                ...(gameState.turnAnswers[sessionKey] ?? {}),
                [pathSegments.join('/')]: Array.isArray(body.value) ? body.value.join(', ') : body.value
            }
            gameState.active = true;

            console.log('gameState', gameState);

            return {
                '!resetPost': true
            }
        }

        
        if (!currentChar) {
            return {
                '!redirect': '/basic/character'
            }
        }

        const order = getPathOrder(pathSegments.join('/'), sessionKey);
        console.log('order ', order);

        if (order === null || order === undefined || order.type === 'auto') {
            return {
                '!errorMsg': 'Routing problem ' + path
            }
        }
        if (order!.type === 'info') {
            return {
                '!redirect': getNextRouteFromLeaf(path, sessionKey) ?? pathSegments.slice(0, 2).join('/')
            }
        }
        if (order!.type === 'select') {
            console.log('seek value ', body.value, ' in options ', order!.options.map(o => o.value));
            const selectedOption = order!.options.find(o => o.value === body.value && !o.disabled);

            console.log('selectedOption', selectedOption);
            if (!selectedOption) {
                return {
                    '!errorMsg': 'Invalid option'
                }
            }

            gameState.active = true;
            
            gameState.turnAnswers[sessionKey] = {
                ...(gameState.turnAnswers[sessionKey] ?? {}),
                [pathSegments.join('/')]: Array.isArray(body.value) ? body.value.join(', ') : body.value
            }
            
            if (!gameState.turnSelections[sessionKey]) {
                gameState.turnSelections[sessionKey] = [];
            }
            gameState.turnSelections[sessionKey] = gameState.turnSelections[sessionKey].filter(path => {
                let keep = true;
                order.options.forEach(option => {
                    if (option.value === body.value) {
                        
                    }
                    if (path.startsWith(`${pathSegments.join('/')}/${option.key}`)) {
                        keep = false;
                    }
                })
                return keep;
            })

            if (!gameState.turnSelections[sessionKey].includes(pathSegments.join('/'))) {
                gameState.turnSelections[sessionKey].push(pathSegments.join('/'));
            }
            
            if (selectedOption.followUp) {
                console.log('selectedOption followUp', selectedOption.followUp);

                return {
                    '!redirect': pathSegments.join('/') + '/' + selectedOption!.key!
                }
            }
            else if (order!.followUp) {
                console.log('order followUp', order!.followUp);
                return {
                    '!redirect': pathSegments.join('/') + '/' + order!.followUp.key!
                }
            }
            else {
                const nextPath = getNextRouteFromLeaf(pathSegments.join('/'), sessionKey);
                console.log('nextPath', nextPath);
                return {
                    '!redirect': nextPath ?? pathSegments.slice(0, 2).join('/')
                }
            }
        }
        else {
            gameState.turnAnswers[sessionKey] = {
                ...(gameState.turnAnswers[sessionKey] ?? {}),
                [pathSegments.join('/')]: Array.isArray(body.value) ? body.value.join(', ') : body.value
            }
            if (!gameState.turnSelections[sessionKey]) {
                gameState.turnSelections[sessionKey] = [];
            }
            gameState.turnSelections[sessionKey].push(pathSegments.join('/'));
        }

        if (order.followUp) {
            return {
                '!redirect': path + '/' + order!.followUp.key!
            }
        }

        const nextPath = getNextRouteFromLeaf(path, sessionKey);
        if (nextPath) {
            return {
                '!redirect': nextPath
            }
        }
        else {
            return {
                '!errorMsg': 'Routing problem'
            }
        }
    }
    else if (pathSegments.length >= 2 && pathSegments[0] === 'admin' && pathSegments[1] === 'adjudicate') {
        return postAdminAdj(params, body);  
    }
    else if(pathSegments.length === 2 && pathSegments[1] === 'turn') {
        return {
            '!redirect': '/client/turn/' + gameState.turnPhaseOrder[0]
        }
    }

    return {
        '!errorMsg': 'No response from Post + ' + path
    };
}