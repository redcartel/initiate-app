import { gameState } from "..";
import { specialKeys } from "../consts";
import { ProcessedParams } from "../game-logic/processParams";
import { addAdmin, addKeyForAdmin } from "../game-logic/sessionKeys";
export function processPostAdmin(info: ProcessedParams) {
    console.log('processPostPlay', info);
    if (info.value === specialKeys.openTurn) {
        console.log('openTurn');
        gameState.turnOpen = true;
        return {
            '!redirect': '/admin/adjudicate'
        }
    }
    else if (info.value === specialKeys.closeTurn) {
        console.log('closeTurn');
        gameState.turnOpen = false;
        return {
            '!redirect': '/admin/adjudicate'
        }
    }
    else if (info.values?.every(value => value.startsWith(specialKeys.addCharacter))) {
        const characterKey = info.values[0].split('::')[1];
        const character = gameState.characters.unassigned.find(c => c.key === characterKey);
        if (!character) {
            return {
                '!errorMsg': 'Character ' + characterKey + ' not found',
                '!resetPost': true
            }
        }
        if (!info.character) {
            gameState.characters.unassigned = gameState.characters.unassigned.filter(c => c.key !== characterKey);
            gameState.characters.assigned[info.sessionKey] = character;
        }
        else {
            const newSessionKey = addKeyForAdmin(info.sessionKey);
            if (!newSessionKey) {
                return {
                    '!errorMsg': 'Failed to create new session key',
                    '!resetPost': true
                }
            }
            gameState.characters.unassigned = gameState.characters.unassigned.filter(c => c.key !== characterKey);
            gameState.characters.assigned[newSessionKey] = character;
        }
        return {
            '!redirect': '/admin/turn/reaction'
        }
    }
    else if (info.section === 'play' && ['reaction', 'action1', 'move1', 'action2', 'move2'].includes(info.phase ?? '__null__')) {
        if (!gameState.adminState) {
            gameState.adminState = {
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
        gameState.adminState.playState.dropDownChecked[info.phase as keyof typeof gameState.adminState.playState.dropDownChecked] = info.value ? Array.isArray(info.value) ? info.value : [info.value] : [];
        return {
            '!resetPost': true
        }

    }
    return null;
}