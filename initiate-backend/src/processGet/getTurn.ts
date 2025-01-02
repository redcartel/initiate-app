import { Params } from "."
import { gameState } from "..";
import { GetResponse } from "../../../initiate-client/src/QueryTypes/getResponse"
import { getPathOrder } from "../game-logic/getPathOrder";

export const getTurn = (params: Params): GetResponse => {
    console.log('getTurn', params);
    const sessionKey = decodeURIComponent(params.sessionKey);
    const pathSegments = decodeURIComponent(params.path).split('/');
    const currentChar = gameState.characters.assigned[sessionKey];
    console.log('sessionKey', sessionKey, 'currentChar', currentChar?.key);

    if (!sessionKey) {
        return {
            layout: 'basic',
            content: {
                type: 'info',
                title: 'Oops!',
                subtitle: 'You are not assigned to this game.',
                description: 'Please check your address and try again.',
                linkButtons: [{ label: 'Go to Home', href: '/basic/join', theme: 'primary' }]
            }
        }
    }

    if (!currentChar) {
        return {
            layout: 'basic',
            content: {
                type: 'info',
                title: 'Oops!',
                subtitle: 'You don\'t have a character assigned.',
                description: 'Please select a character.',
                linkButtons: [{ label: 'Go to Character', href: '/basic/character', theme: 'primary' }]
            }
        }
    }
    // const turn = pathSegments[pathSegments.length - 1];

    console.log(pathSegments);

    let response: GetResponse = {
        layout: 'client',
        content: {
            type: 'info',
            title: 'No Order Found',
            subtitle: 'No order found for this address',
            description: 'Please check your address and try again.',
            linkButtons: [{ label: 'Go to Turn', href: '/client/turn', theme: 'primary' }]
        }
    }

    if (pathSegments.length < 2) {
        if (gameState.characters.assigned[sessionKey]) {
            // Pass
        } else {
            response.content = {
                type: 'info',
                title: 'Oops!',
                subtitle: 'You are not assigned to this game.',
                description: 'Please check your address and try again.',
                linkButtons: [{ label: 'Go to Home', href: '/client', theme: 'primary' }]
            }
        }
    } else if (pathSegments.length === 2 && pathSegments[1] === 'turn') {
        response = {
            layout: 'client',
            content: {
                type: 'info',
                title: 'Next Turn',
                subtitle: 'Enter Your Orders',
                description: 'Select how you will use your reaction, movement, action, and bonus action.',
                linkButtons: [{ label: 'Set Reaction...', href: '/client/turn/reaction', theme: 'action' }]
            }
        }
    }
    else if (pathSegments[1] === 'turn') {
        console.log('seek turn order');
        const order = getPathOrder(decodeURIComponent(pathSegments.join('/')), sessionKey);
        console.log('order', order)
        if (order) {
            response = {
                layout: 'client',
                content: order
            }
        }
        else {
            response = {
                layout: 'client',
                content: {
                    type: 'info',
                    title: 'Oops!',
                    subtitle: 'Something went wrong',
                    description: 'We don\'t know how you got here.',
                    linkButtons: [{ label: 'Go to Turn', href: '/client/turn', theme: 'primary' }]
                }
            }
        }
    }

    response.header = {
        title: gameState.characters.assigned[sessionKey]?.name ?? 'No Character',
        subtitle: gameState.name
    }

    response.footer = {
        infoText: `Turn ${gameState.turn + 1}`
    }

    response.phaseSelect = [
        { label: 'React', href: '/client/turn/reaction', theme: 'action' },
        { label: 'Move', href: '/client/turn/move', theme: 'action' },
        { label: 'Act', href: '/client/turn/action', theme: 'action' },
        { label: 'Move', href: '/client/turn/move2', theme: 'action' },
        { label: 'Review', href: '/client/turn/review', theme: 'action' }
    ]   

    return response;
}