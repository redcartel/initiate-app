import { Params } from "."
import { gameState, phaseSelect } from "..";
import { GetResponse } from "../../../initiate-client/src/QueryTypes/getResponse"
import { specialKeys } from "../consts";
import { getPathOrder } from "../game-logic/getPathOrder";
import { Character } from "../types";

const getCharacterHtmlLink = (currentChar: Character) => {
    if (!currentChar.htmlLink) return undefined;
    return (process.env.BASE_URL ?? 'http://localhost:3031') + currentChar.htmlLink;
}

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
                linkButtons: [{ label: 'Go to Home', href: '/', theme: 'primary' }]
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
                linkButtons: [{ label: 'Go to Character', href: '/basic/character', theme: 'primary' }, { label: 'Go to Home', href: '/', theme: 'secondary' }]
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
            linkButtons: [{ label: 'Go to Turn', href: '/client/turn', theme: 'primary' }, { label: 'Go to Home', href: '/', theme: 'secondary' }]
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
                linkButtons: [{ label: 'Go to Home', href: '/', theme: 'primary' }]
            }
        }
    } 
    // else if (pathSegments.length === 2 && pathSegments[1] === 'turn') {
    //     response = {
    //         layout: 'client',
    //         content: {
    //             type: 'info',
    //             title: 'Next Turn',
    //             subtitle: 'Enter Your Orders',
    //             description: 'Select how you will use your reaction, movement, action, and bonus action.',
    //             linkButtons: [{ label: 'Set Reaction...', href: '/client/turn/reaction', theme: 'action' }]
    //         }
    //     }
    // }
    else if (pathSegments[1] === 'turn') {
        console.log('seek turn order');
        const order = getPathOrder(decodeURIComponent(pathSegments.join('/')), sessionKey);
        console.log('order', order)
        if (order && order.type !== 'auto') {
            response = {
                layout: 'client',
                content: order.type === 'info' ? order : {
                    ...order,
                    savedValue: gameState.turnAnswers[sessionKey] ? gameState.turnAnswers[sessionKey][pathSegments.join('/')] ?? undefined : undefined,
                    htmlLink: order.htmlLink ? (process.env.BASE_URL ?? 'http://localhost:3031') + order.htmlLink : undefined
                },
                header: {
                    title: gameState.characters.assigned[sessionKey]?.name ?? 'No Character',
                    subtitle: gameState.name
                },
                footer: {
                    htmlLink: getCharacterHtmlLink(currentChar)
                },
                phaseSelect
            } as GetResponse 
        }
        else if (order && order.type === 'auto') {
            console.log('review order page');
            response = {
                layout: 'client',
                content: {
                    type: 'select',
                    title: 'Review Order',
                    key: specialKeys.reviewOrderPage,
                    subtitle: 'This is what the GM will see',
                    description: generateReviewDescription(sessionKey),
                    instantSubmit: true,
                    options: [
                        { label: 'I\'m ready!', value: specialKeys.ordersReady, key: specialKeys.ordersReady, theme: 'action' },
                        { label: 'I\'m not ready!', value: specialKeys.ordersNotReady, key: specialKeys.ordersNotReady, theme: 'destructive' }
                    ]
                },
                header: {
                    title: gameState.characters.assigned[sessionKey]?.name ?? 'No Character',
                    subtitle: gameState.name
                },
                footer: {
                    htmlLink: getCharacterHtmlLink(currentChar)
                },
                phaseSelect: phaseSelect
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

    if (response.layout === 'basic') {
        return response;
    }

    response.footer = {
        htmlLink: getCharacterHtmlLink(currentChar)
    }

    response.phaseSelect = phaseSelect;

    return response;
}

function generateReviewDescription(sessionKey: string) {
    const phaseKeys = gameState.turnPhaseOrder;
    const orders : string[] = [];

    phaseKeys.forEach(phaseKey => {
        orders.push(`${gameState.turnSelections[sessionKey]?.filter(key => key.startsWith(`client/turn/${phaseKey}`)).sort()?.map(key => `${key}: ${gameState.turnAnswers[sessionKey][key]}`).join(' __break__') ?? ''}`)
    });

    return orders.join('__break__ __break__')
}