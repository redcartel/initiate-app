import { gameState } from "..";
import { OrderContent } from "../../../initiate-client/src/QueryTypes/getResponse";

export const getPathOrder = (path: string, sessionKey: string) => {
    console.log('getPathOrder', path, sessionKey);
    const pathSegments = path.split('/');
    const currentChar = gameState.characters.assigned[sessionKey];
    console.log('sessionKey', sessionKey, 'currentChar', currentChar?.key);
    if (pathSegments.length < 2) {
        return null;
    }
    if (pathSegments[1] !== 'turn') {
        return null;
    }
    if (pathSegments.length === 2) {
        return currentChar?.orderOptions[gameState.turnPhaseOrder[0]];
    }
    if (pathSegments.length === 3) {
        console.log('pathSegments', pathSegments);
        return currentChar?.orderOptions[gameState.turnPhaseOrder[gameState.turnPhaseOrder.indexOf(pathSegments[2]) + 1]] ?? null;
    }

    let order = currentChar?.orderOptions[pathSegments.shift()!];
    if (!order) {
        return null;
    }
    while (pathSegments.length > 0) {
        if (order.type === 'info') {
            console.log('info must be leaf node');
            return null;
        }
        let optionKeys : string[] = [];
        let followUpKey : string | null = null;

        if (order.type === 'select') {
            optionKeys = order.options.map(option => option.key!);
            followUpKey = order.followUp?.key ?? null;
        }
        let nextOrder : OrderContent;
        const key = pathSegments.shift()!;
        if (followUpKey === key) {
            nextOrder = order.followUp!;
        } else if (order.type === 'select' && optionKeys.includes(key)) {
            nextOrder = order.options.find(option => option.key === key)?.followUp!;
        } else {
            console.log('fail to find next order with key ', key, ' from ', order);
            return null;
        }
        order = nextOrder;
    }
    return order;
}

export const getNextRouteFromLeaf = (path: string, sessionKey: string) : string | null => {
    console.log('getNextRouteFromLeaf', path, sessionKey);
    const pathSegments = path.split('/');
    const currentChar = gameState.characters.assigned[sessionKey];
    if (pathSegments.length < 2) {
        console.log('not enough segments');
        return null;
    }
    let sessionType = pathSegments[0];
    if (pathSegments[1] !== 'turn') {
        console.log('not turn');
        return null;
    }
    if (pathSegments.length === 2) {
        console.log('__stuck__');
        return '__stuck__';
    }
    let turnPhase = pathSegments[2];
    const keySegments = pathSegments.slice(0, 2);
    const orderList = pathSegments.map((_segment, index) => getPathOrder(keySegments.concat(pathSegments.slice(index+1)).join('/'), sessionKey));
    console.log('orderList', orderList.map(o => o?.title));
    let nextRoute : string | null = null;
    for (let i = orderList.length - 2; i >= 0; i--) {
        const order = orderList[i];
        if (order?.type === 'info') {
            throw new Error('info must be leaf node');
        }
        if (order?.followUp) {
            const nextPath = sessionType + '/turn/' + pathSegments.slice(0, i+1).join('/');
            console.log('nextPath', nextPath);
            return nextPath;
        }
    }
    const turnIndex = gameState.turnPhaseOrder.indexOf(turnPhase);
    if (turnIndex === gameState.turnPhaseOrder.length - 1) {
        console.log('__submit_turn__');
        return '__submit_turn__';
    }
    console.log(sessionType + '/turn/' + gameState.turnPhaseOrder[turnIndex + 1]);
    return sessionType + '/turn/' + gameState.turnPhaseOrder[turnIndex + 1];
}