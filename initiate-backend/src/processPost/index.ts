import { PostBody } from "../../../initiate-client/src/QueryTypes/postBody";
import { PostResponse } from "../../../initiate-client/src/QueryTypes/postResponse";
import { Params } from "../processGet";
import crypto from 'crypto';
import { gameState } from "../index";
import { getNextRouteFromLeaf, getPathOrder } from "../game-logic/getPathOrder";

export function processPost(body: PostBody, params: Params): PostResponse {
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
            return {
                '!redirect': '/client/turn'
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
        const order = getPathOrder(path, sessionKey);
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
            const selectedOption = order!.options.find(o => o.value === body.value && o.disabled === false);
            if (!selectedOption) {
                return {
                    '!errorMsg': 'Invalid option'
                }
            }
            else if (selectedOption.followUp) {
                return {
                    '!redirect': path + '/' + selectedOption!.key!
                }
            }
            else if (order!.followUp) {
                return {
                    '!redirect': path + '/' + order!.followUp.key!
                }
            }
            else {
                return {
                    '!redirect': getNextRouteFromLeaf(path, sessionKey) ?? pathSegments.slice(0, 2).join('/')
                }
            }
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
    else if(pathSegments.length === 2 && pathSegments[1] === 'turn') {
        return {
            '!redirect': '/client/turn/' + gameState.turnPhaseOrder[0]
        }
    }

    return {
        '!errorMsg': 'No response from Post + ' + path
    };
}