import { gameState } from "..";
import { specialKeys } from "../consts";
import { ProcessedParams } from "../game-logic/processParams";

export function processPostPlay(info: ProcessedParams) {
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
    return null;
}