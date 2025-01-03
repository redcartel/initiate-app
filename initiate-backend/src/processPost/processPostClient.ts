import { gameState } from "..";
import { PostResponse } from "../../../initiate-client/src/QueryTypes/postResponse";
import { getNextRouteFromLeaf, getPathOrder } from "../game-logic/getPathOrder";
import { ProcessedParams } from "../game-logic/processParams";

export function sortTurnSelections(a: string, b: string) {
    const aSegments = a.split('/');
    const bSegments = b.split('/');
    const aIndex = gameState.turnPhaseOrder.findIndex(phase => phase === aSegments[0]);
    const bIndex = gameState.turnPhaseOrder.findIndex(phase => phase === bSegments[0]);
    if (aIndex !== bIndex) {
        return aIndex - bIndex;
    }
    return aSegments[aSegments.length - 1].localeCompare(bSegments[bSegments.length - 1]);
}

export function processPostAnswerValue(info: ProcessedParams) {
    const pathSegments = info.pathSegments;
    const prefix = 'client';
    const path = pathSegments.join('/');
    if (!gameState.turnOpen) {
        return {
            '!errorMsg': 'Turn is being played',
            '!redirect': '/' + pathSegments[0] + '/turn/review'
        }
    }
    if (info.orderStep?.type === 'select') {
        const option = info.orderStep.options.find(option => option.value === info.value);
        if (!option) {
            return {
                '!errorMsg': 'Invalid option',
            }
        }
        if (option.disabled) {
            return {
                '!errorMsg': 'Option is disabled',
            }
        }
        if (!option.value) {
            return {
                '!errorMsg': 'No submitted value',
            }
        }
        if (!gameState.turnSelections[info.sessionKey]) {
            gameState.turnSelections[info.sessionKey] = [];
        }
        if (!gameState.turnAnswers[info.sessionKey]) {
            gameState.turnAnswers[info.sessionKey] = {};
        }
        info.orderStep.options.forEach(option => {
            if (option.key !== info.value && !(info.valueIsSpecial && info.value?.includes(option.key))) {
                return;
            }
            else {
                gameState.turnSelections[info.sessionKey] = gameState.turnSelections[info.sessionKey].filter(path => {
                    if (path.startsWith(info.path + '/' + option.key) || path.startsWith('/' + info.path + '/' + option.key)) {
                        return false;
                    }
                    return true;
                })
                // gameState.turnSelections[info.sessionKey] = gameState.turnSelections[info.sessionKey].filter(path => {
                //     const pathPrefix = path.startsWith(info.path) ? info.path : '/' + info.path + '/' + option.key;
                //     if (path.startsWith(info.layout + '/' + info.section + '/' + info.phase) {

                //     }
                // })
            }
        })
    }
    if (!gameState.turnSelections[info.sessionKey].includes(info.path)) {
        gameState.turnSelections[info.sessionKey] = [...gameState.turnSelections[info.sessionKey], info.path].sort(sortTurnSelections);
    }
    gameState.turnAnswers[info.sessionKey][info.path] = info.value!;
    return null;
}

export function processPostClient(info: ProcessedParams): PostResponse | null {
    const prefix = info.pathSegments[0] === 'admin' ? 'admin' : 'client';
    if (!info.character) {
        return {
            '!errorMsg': 'No character associated with this session',
            '!redirect': '/' + prefix + '/basic/character'
        }
    }
    if (info.path.endsWith('/review/finish')) {
        processPostAnswerValue(info);
        return {
            '!resetPost': true
        }
    }

    if (!info.orderStep) {
        return {
            '!errorMsg': 'No order step associated with this path',
        }
    }
    const answerErrorResponse = processPostAnswerValue(info);
    if (answerErrorResponse) {
        return answerErrorResponse;
    }
    if (info.orderStep.type === 'select') {
        const optionWithFollowup = info.orderStep.options.find(option => option.key === info.value || info.valueIsSpecial && info.value?.includes(option.key) && option.followUp);
        const redirectPath = info.path + '/' + optionWithFollowup?.key /* + '/' + optionWithFollowup?.followUp?.key */;
        console.log('redirectPath', redirectPath);
        const newOrder = getPathOrder(redirectPath, info.sessionKey);
        console.log('newOrder', newOrder?.title);
        if (newOrder) {
            return {
                '!redirect': redirectPath
            }
        }
    }
    if (info.orderStep.type !== 'info' && info.orderStep.type !== 'dropdownList' && info.orderStep.type !== 'redirect' && info.orderStep.followUp) {
        return {
            '!redirect': info.path + '/' + info.orderStep.followUp!.key
        }
    }
    return {
        '!redirect': getNextRouteFromLeaf(info.path, info.sessionKey) || '/' + prefix + '/turn'
    }
}