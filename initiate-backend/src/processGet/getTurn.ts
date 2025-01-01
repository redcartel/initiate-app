import { Params } from "."
import { gameState } from "..";
import { GetResponse } from "../../../initiate-client/src/QueryTypes/getResponse"

export const getTurn = (params: Params): GetResponse => {
    const sessionKey = decodeURIComponent(params.sessionKey);
    const pathSegments = decodeURIComponent(params.path).split('/');
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
    } else if (pathSegments[pathSegments.length - 1] === 'turn') {
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
    else if (pathSegments.length === 3) {
        response = {
            layout: 'client',
            content: gameState.characters.assigned[sessionKey].orderOptions[pathSegments[pathSegments.length - 1]] ?? {
                type: 'info',
                title: 'Oops!',
                subtitle: 'Something went wrong',
                description: 'We don\'t know how you got here.',
                linkButtons: [{ label: 'Go to Turn', href: '/client/turn', theme: 'primary' }]
            }
        }
    }

    response.header = {
        title: gameState.characters.assigned[sessionKey].name,
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