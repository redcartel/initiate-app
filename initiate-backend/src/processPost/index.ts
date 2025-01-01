import { PostBody } from "../../../initiate-client/src/QueryTypes/postBody";
import { PostResponse } from "../../../initiate-client/src/QueryTypes/postResponse";
import { Params } from "../processGet";
import crypto from 'crypto';
import { gameState } from "../index";

export function processPost(body: PostBody, params: Params): PostResponse {
    console.log('processPost', body, params);
    const path = decodeURIComponent(params.path);
    const sessionKey = decodeURIComponent(params.sessionKey);
    const currentChar = gameState.characters.assigned[sessionKey];

    console.log('path', path);
    let response: PostResponse = {
        '!redirect': '/err'
    };

    if (path === 'basic' || path === '') {
        response = {
            '!redirect': '/basic/join'
        }
    }

    if (path === 'basic/join') {
        if (body.value === process.env.GAME_KEY) {
            const sessionKey = crypto.randomUUID();
            gameState

            response = {
                '!newSessionKey': crypto.randomUUID(),
                '!redirect': '/basic/character'
            }
        }
        else {
            console.log('Invalid game code');
            console.log(body.value, '!=', process.env.GAME_KEY);
            response = {
                '!errorMsg': 'Invalid game code'
            }
        }
    }

    if (path === 'basic/character') {
        const char = gameState.characters.unassigned.find(c => c.key === body.value);
        if (char && !currentChar) {
            gameState.characters.unassigned = gameState.characters.unassigned.filter(c => c.key !== char.key);
            gameState.characters.assigned[sessionKey] = char;
            response = {
                '!redirect': '/client/turn'
            }
        }
        else if (char && currentChar) {
            gameState.characters.unassigned.push(currentChar);
            gameState.characters.assigned[sessionKey] = char!;
            response = {
                '!redirect': '/client/turn'
            }
        }
        else {
            response = {
                '!errorMsg': 'Character already assigned'
            }
        }
    }

    if (path === 'basic/bio') {
        response = {
            '!redirect': '/client/turn'
        }
    }

    console.log('response', response);
    return response;
}