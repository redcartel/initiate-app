import { PostBody } from "../../../initiate-client/src/QueryTypes/postBody";
import { PostResponse } from "../../../initiate-client/src/QueryTypes/postResponse";
import { Params } from "../processGet";
import crypto from 'crypto';
import { gameState, redisClient, setGameState } from "../index";
import { getNextRouteFromLeaf, getPathOrder } from "../game-logic/getPathOrder";
import { specialKeys } from "../consts";
import { postAdminAdj } from "./admin/postAdminAdj";
import { postAdminPlay } from "./admin/postAdminPlay";
import { processParams } from "../game-logic/processParams";
import { getCharacterAndSessionKey } from "../game-logic/getCharacter";
import { addAdmin, addClient, addKeyForAdmin, addKeyForClient, getMyAdminKeyGroup, getMySessionKeyGroup, removeClient } from "../game-logic/sessionKeys";

export const processPost = (body: PostBody, params: Params): PostResponse => {
    const info = processParams(params, body);
    console.log('processPost', info);

    if (info.isAdmin && info.value=== specialKeys.closeTurn) {
        gameState.active = false;
        return {
            '!redirect': '/admin/adjudicate'
        }
    }
    if (info.isAdmin && info.value === specialKeys.openTurn) {
        gameState.active = true;
        return {
            '!redirect': '/admin/adjudicate'
        }
    }
    if (info.isAdmin && info.value === specialKeys.nextTurn) {
        gameState.active = true;
        gameState.turn += 1;
        return {
            '!redirect': '/admin/adjudicate'
        }
    }
    if (info.isAdmin && info.value?.includes(specialKeys.removePlayer)) {
        const segments = info.value?.split('::');
        if (segments && segments.length === 2) {
            const characterKey = segments[1];
            const { character, sessionKey } = getCharacterAndSessionKey(characterKey) ?? { character: undefined, sessionKey: undefined };
            if (character && sessionKey) {
                delete gameState.characters.assigned[sessionKey];
                gameState.characters.unassigned.push(character);
                return {
                    '!redirect': '/admin/adjudicate'
                }
            }
        }
    }
    if (info.value?.includes(specialKeys.pickCharacter) && info.sessionKey && !info.character) {
        const segments = info.value?.split('::');
        if (segments && segments.length === 2) {
            const characterKey = segments[1];
            const { character, sessionKey } = getCharacterAndSessionKey(characterKey) ?? { character: undefined, sessionKey: undefined };
            if (character && !sessionKey) {
                gameState.characters.unassigned = gameState.characters.unassigned.filter(c => c.key !== character.key);
                gameState.characters.assigned[info.sessionKey] = character;
                return {
                    '!redirect': '/admin/adjudicate'
                }
            }
            else if (character) {
                return {
                    '!errorMsg': 'Character already assigned'
                }
            }
            else {
                return {
                    '!errorMsg': 'Character not found'
                }
            }
        }
    }
    if (info.value?.includes(specialKeys.switchCharacter) && info.sessionKey && info.character) {
        const groupKeys = info.isAdmin ? getMyAdminKeyGroup(info.sessionKey) : getMySessionKeyGroup(info.sessionKey);
        const segments = info.value?.split('::');
        if (!segments || segments.length !== 2) {
            return {
                '!errorMsg': 'Invalid switch character command'
            }
        }
        const characterSessionKey = Object.entries(gameState.characters.assigned).find(entry => entry[1].key === segments[1])?.[0] ?? '__notFound__';
        if (!characterSessionKey || !groupKeys.includes(characterSessionKey)) {
            return {
                '!errorMsg': 'Character not found'
            }
        }
        return {
            '!redirect': '/admin/adjudicate'
        }
    }
    if (info.value?.includes(specialKeys.addCharacter) && info.character && info.sessionKey) {
        const groupKeys = info.isAdmin ? getMyAdminKeyGroup(info.sessionKey) : getMySessionKeyGroup(info.sessionKey);
        const segments = info.value?.split('::');
        if (!segments || segments.length !== 2) {
            return {
                '!errorMsg': 'Invalid add character command'
            }
        }
        const characterKey = segments[1];
        const { character, sessionKey } = getCharacterAndSessionKey(characterKey) ?? { character: undefined, sessionKey: undefined };
        if (character && !sessionKey) {
            gameState.characters.unassigned = gameState.characters.unassigned.filter(c => !c.npcOnly).filter(c => c.key !== character.key);
            const newSessionKey = info.isAdmin ? addKeyForAdmin(info.sessionKey) : addKeyForClient(info.sessionKey);
            if (!newSessionKey) {
                return {
                    '!errorMsg': 'Failed to create new session key'
                }
            }
            gameState.characters.assigned[newSessionKey] = character;
            return {
                '!redirect': '/admin/adjudicate',
                '!newSessionKey': newSessionKey
            }
        }
    }
    if (info.specialKeySegment === specialKeys.join) {
        if (!info.value) {
            return {
                '!errorMsg': 'Invalid join code : no code'
            }
        }
        const joinCode = info.value;
        const parsedJoinCode = joinCode.toLowerCase().trim().split(/[ -]/).join('-');
        const target = process.env.GAME_KEY ?? 'play-tactics';
        console.log('parsedJoinCode', parsedJoinCode, ' seeking ', target);
        if (parsedJoinCode === target) {
            if (info.sessionKey && info.character) {
                return {
                    '!redirect': '/client/turn/' + gameState.turnPhaseOrder[0]
                }
            }
            if (info.sessionKey) {
                return {
                    '!redirect': '/basic/character'
                }
            }
            else {
                addClient(info.sessionKey);
                return {
                    '!redirect': '/basic/character'
                }
            }
        }
        else {
            return {
                '!errorMsg': 'Invalid join code'
            }
        }
    }
    if (info.value?.includes(specialKeys.gameCreate)) {
        const segments = info.value?.split('::');
        if (!segments || segments.length !== 2) {
            return {
                '!errorMsg': 'Invalid game create command'
            }
        }
        const createCode = segments[1];
        if (createCode.toLowerCase().trim().split(/[ -]/).join('-') === (process.env.ADMIN_KEY ?? 'creation-games-gm')) {
            const sessionKey = crypto.randomUUID();
            addAdmin(sessionKey);
            if (info.sessionKey && info.isAdmin) {
                return {
                    '!redirect': '/admin/adjudicate'
                }
            }
            else if (info.sessionKey) {
                const groupKeys = getMySessionKeyGroup(info.sessionKey);
                removeClient(info.sessionKey);
                gameState.adminKeyGroups.push(groupKeys);
                return {
                    '!redirect': '/admin/adjudicate'
                }
            }
            else {
                const newSessionKey = addKeyForAdmin(sessionKey);
                if (!newSessionKey) {
                    return {
                        '!errorMsg': 'Failed to create new session key'
                    }
                }
                return {
                    '!newSessionKey': newSessionKey,
                    '!redirect': '/admin/adjudicate'
                }
            }
        }
        else {
            return {
                '!errorMsg': 'Invalid game create code'
            }
        }
    }

    return {
        '!errorMsg': 'No response from Post + ' + info.path,
        '!redirect': '/'
    }
}

export async function _processPost(body: PostBody, params: Params): Promise<PostResponse> {
    if (!gameState.active) {
        if (redisClient?.isReady) {
            const gameStateStore = await redisClient.get('gameState');
            if (gameStateStore) {
                setGameState(JSON.parse(gameStateStore));
            }
        }
    }
    
    // console.log('processPost', body, params);
    const path = decodeURIComponent(params.path);
    const sessionKey = decodeURIComponent(params.sessionKey);
    const currentChar = gameState.characters.assigned[sessionKey];

    // console.log('path', path);

    if (path === 'basic' || path === '') {
        return {
            '!redirect': '/basic/join'
        }
    }

    if (path === 'basic/game-create') {
        if (body.value === process.env.ADMIN_KEY) {
            const sessionKey = crypto.randomUUID();
            // gameState.adminKey = sessionKey;
            // console.log('setting adminsession key', sessionKey);

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
            const newSessionKey = sessionKey ?? crypto.randomUUID();
            // console.log('setting session key', newSessionKey);

            return {
                '!newSessionKey': newSessionKey,
                '!redirect': '/basic/character'
            }
        }
        else {
            // console.log('Invalid game code');
            // console.log(body.value, '!=', process.env.GAME_KEY);
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
        // console.log('seek char', gameState.characters.unassigned.map(c => c.key));
        const char = gameState.characters.unassigned.find(c => c.key === body.value);
        // console.log('char', char?.key);
        // console.log('current char', currentChar?.key);
        if (char && !currentChar) {
            // console.log('setting character ', char.key, ' for session', sessionKey);
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

    // console.log('path segments:', pathSegments);

    if (pathSegments.length === 3 && pathSegments[0] === 'admin' && pathSegments[1] === 'play') {
        return postAdminPlay(params, body);
    }

    if (pathSegments.length > 2 && pathSegments[1] === 'turn') {
        // console.log('post turn');
        // console.log('pathSegments', pathSegments);
        // console.log('body value', body.value);

        if (pathSegments.length === 3 && pathSegments[2] === specialKeys.reviewOrderPage) {
            // console.log('review order page');


            gameState.turnAnswers[sessionKey] = {
                ...(gameState.turnAnswers[sessionKey] ?? {}),
                [pathSegments.join('/')]: Array.isArray(body.value) ? body.value.join(', ') : body.value
            }
            gameState.active = true;

            // console.log('gameState', gameState);

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
        // console.log('order ', order);

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
            // console.log('seek value ', body.value, ' in options ', order!.options.map(o => o.value));
            const selectedOption = order!.options.find(o => o.value === body.value && !o.disabled);

            // console.log('selectedOption', selectedOption);
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
                // console.log('selectedOption followUp', selectedOption.followUp);

                return {
                    '!redirect': pathSegments.join('/') + '/' + selectedOption!.key!
                }
            }
            else if (order!.followUp) {
                // console.log('order followUp', order!.followUp);
                return {
                    '!redirect': pathSegments.join('/') + '/' + order!.followUp.key!
                }
            }
            else {
                const nextPath = getNextRouteFromLeaf(pathSegments.join('/'), sessionKey);
                // console.log('nextPath', nextPath);
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

        if (order.type !== 'dropdownList' && order.followUp) {
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