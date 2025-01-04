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
import { processPostClient } from "./processPostClient";
import { processPostAdmin } from "./processPostAdmin";

export const processPost = (body: PostBody, params: Params): PostResponse => {
    const info = processParams(params, body);
    console.log('processPost', info);

    if (info.value === specialKeys.requestRedirect) {
        if (info.isAdmin && info.character) {
            if (gameState.turnOpen) {
                return {
                    '!redirect': '/admin/turn/reaction' 
                }
            }
            else {
                return {
                    '!redirect': '/admin/play/reaction'
                }
            }
        }
        else if (info.isAdmin) {
            if (gameState.turnOpen) {
                return {
                    '!redirect': '/admin/adjudicate' 
                }
            }
            else {
                return {
                    '!redirect': '/admin/play/reaction'
                }
            }
        }
        else if (info.character) {
            if (gameState.turnOpen) {
                return {
                    '!redirect': '/client/turn' + gameState.turnPhaseOrder[0]
                }
            }
            else {
                return {
                    '!redirect': '/client/turn/review'
                }
            }
        }
        else {
            return {
                '!redirect': '/basic'
            }
        }
    }

    if (info.isAdmin && info.value === specialKeys.closeTurn) {
        gameState.turnOpen = false;
        return {
            '!errorMsg': 'Turn is closed',
            '!redirect': '/admin/adjudicate'
        }
    }
    if (info.isAdmin && info.value === specialKeys.openTurn) {
        gameState.turnOpen = true;
        return {
            '!errorMsg': 'Turn is open',
            '!redirect': '/admin/adjudicate'
        }
    }
    if (info.isAdmin && info.value === specialKeys.nextTurn) {
        gameState.turnOpen = true;
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
    if (info.value?.includes(specialKeys.pickCharacter)) {
        console.log('pick character');
        if (info.character) {
            return {
                '!errorMsg': 'You already have a character',
                '!redirect': '/client/turn/' + gameState.turnPhaseOrder[0]
            }
        }
        let newSessionKey = undefined;
        if (!info.sessionKey) {
            const sessionKey = crypto.randomUUID();
            addClient(sessionKey);
            info.sessionKey = sessionKey;
            newSessionKey = sessionKey;
        }
        const segments = info.value?.split('::');
        if (segments && segments.length === 2) {
            const characterKey = segments[1];
            const { character, sessionKey } = getCharacterAndSessionKey(characterKey) ?? { character: undefined, sessionKey: undefined };
            console.log('character', character, 'sessionKey', sessionKey);
            if (character && !sessionKey) {
                gameState.characters.unassigned = gameState.characters.unassigned.filter(c => c.key !== character.key);
                gameState.characters.assigned[info.sessionKey] = character;
                return {
                    '!redirect': '/client/turn/' + gameState.turnPhaseOrder[0],
                    ...(newSessionKey && { '!newSessionKey': newSessionKey } || {})
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
        console.log('SWITCH CHARACTER GROUP KEYS', groupKeys);
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
        if (info.isAdmin) {
            return {
                '!newSessionKey': characterSessionKey,
                '!redirect': '/admin/turn/' + gameState.turnPhaseOrder[0]
            }
        }
        else {
            return {
                '!newSessionKey': characterSessionKey,
                '!redirect': '/client/turn/' + gameState.turnPhaseOrder[0]
            }
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
    if (info.specialKeySegment === specialKeys.gameCreate) {
        const createCode = info.value?.toLowerCase().trim().split(/[ -]/).join('-');
        const target = process.env.ADMIN_KEY ?? 'creation-games-gm';
        console.log('createCode', createCode, 'seeking', target);
        if (createCode === target && info.isAdmin) {
            return {
                '!redirect': '/admin/adjudicate'
            }
        }
        if (createCode === target && !info.sessionKey) {
            const sessionKey = crypto.randomUUID();
            addAdmin(sessionKey);
            return {
                '!newSessionKey': sessionKey,
                '!redirect': '/admin/adjudicate'
            }
        }
            else if (createCode === target && info.sessionKey) {
                console.log('session key', info.sessionKey);
                const groupKeys = getMySessionKeyGroup(info.sessionKey);
                console.log('groupKeys', groupKeys);
                removeClient(info.sessionKey);
                if (!gameState.adminKeyGroups) {
                    gameState.adminKeyGroups = [];
                }
                gameState.adminKeyGroups.push(groupKeys.length > 0 ? groupKeys : [info.sessionKey]);

                return {
                    '!redirect': '/admin/adjudicate'
                }
            }
        else {
            return {
                '!errorMsg': 'Invalid game create code'
            }
        }
    }
    if (info.character && !info.isAdmin && info.layout === 'client' && info.section === 'turn') {
        const clientResponse : PostResponse | null= processPostClient(info);
        if (clientResponse) {
            return clientResponse;
        }
    }
    if (info.isAdmin && info.layout === 'admin') {
        const adminResponse : PostResponse | null= processPostAdmin(info);
        console.log('adminResponse', adminResponse);
        if (adminResponse) {
            return adminResponse;
        }
    }
    return {
        '!errorMsg': 'No response from Post + ' + info.path,
        '!resetPost': true
    }
}