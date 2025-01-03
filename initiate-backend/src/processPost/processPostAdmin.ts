import { gameState } from "..";
import { specialKeys } from "../consts";
import { ProcessedParams } from "../game-logic/processParams";

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