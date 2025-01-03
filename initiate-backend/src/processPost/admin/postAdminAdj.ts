import { gameState } from "../..";
import { PostBody } from "../../../../initiate-client/src/QueryTypes/postBody";
import { PostResponse } from "../../../../initiate-client/src/QueryTypes/postResponse";
import { specialKeys } from "../../consts";
import { Params } from "../../processGet";

export const removePlayer = (playerKey: string) => {
    const [session, character] = Object.entries(gameState.characters.assigned).find(([_, c]) => c.key === playerKey) ?? [undefined, undefined];
    if (!character) {
        return {
            '!errorMsg': 'Character not found',
            '!redirect': '/admin/adjudicate'
        }
    }
    delete gameState.characters.assigned[session];
    gameState.characters.unassigned.push(character);
    return {
        '!redirect': '/admin/adjudicate'
    }
}

export function postAdminAdj(params: Params, body: PostBody) : PostResponse {
    console.log('postAdminAdj', params, body);
    const pathSegments = decodeURIComponent(params.path).split('/');
    const sessionKey = params.sessionKey;
    if (!gameState.adminKey || gameState.adminKey !== sessionKey) {
        return {
            '!errorMsg': 'You are not an admin',
            '!redirect': '/'
        }
    }
    const key = pathSegments.join('/');

    if (pathSegments.length < 2 || pathSegments[0] !== 'admin' || pathSegments[1] !== 'adjudicate') {
        return {
            '!errorMsg': 'Invalid path',
            '!redirect': '/'
        }
    }

    const value = Array.isArray(body.value) ? body.value.join('::') : body.value;
    Object.entries(specialKeys).forEach(([k, v]) => {
        if (value.includes(v)) {
            switch (v) {
                case specialKeys.removePlayer:
                    console.log('removePlayer', value);
                    const playerKey = value.split('::')[1];
                    console.log('playerKey', playerKey);
                    if (playerKey) {
                        removePlayer(playerKey);
                    }
                    pathSegments.pop();
                    return {
                        '!redirect': pathSegments.join('/')
                    }
                case specialKeys.closeTurn:
                    gameState.turnOpen = false;
                    return {
                        '!redirect': pathSegments.slice(0, -1).join('/') + '/turn/' + gameState.turnPhaseOrder[0]
                    }
                case specialKeys.openTurn:
                    gameState.turnOpen = true;
                    return {
                        '!reset': true
                    }
                case specialKeys.nextTurn:
                    gameState.turn += 1
                    gameState.turnOpen = true;
                    return {
                        '!redirect': pathSegments.slice(0, -1).join('/') + '/turn/' + gameState.turnPhaseOrder[0]
                    }
                case specialKeys.goBack:
                    pathSegments.pop();
                    return {
                        '!redirect': pathSegments.join('/')
                    }
            }
        }
    });

    if (pathSegments.length === 2) {
        for (const [key, char] of Object.entries(gameState.characters.assigned)) {
            if (char.key === value) {
                return {
                    '!redirect': `/admin/adjudicate/${char.key}`
                }
            }
        }
    }

    return {
        '!errorMsg': 'No response from Post + ' + pathSegments.join('/'),
        '!redirect': '/admin/adjudicate'
    }
}