import { Params } from ".";
import { gameState, phaseSelect } from "..";
import { BasicResponse, ClientResponse, DropdownListOption } from "../../../initiate-client/src/QueryTypes/getResponse";
import { specialKeys } from "../consts";
import { getCharacterAndSessionKey, getCharacterFromSessionKey } from "../game-logic/getCharacter";
import { getPathOrder } from "../game-logic/getPathOrder";
import { ProcessedParams, processParams } from "../game-logic/processParams";
import { getMySessionKeyGroup } from "../game-logic/sessionKeys";

export const checkForSpecialKeyResponse = (charCode: string, key: typeof specialKeys[keyof typeof specialKeys]) => {
    const charSess = getCharacterAndSessionKey(charCode);
    if (!charSess) {
        return false;
    }
    const { character, sessionKey } = charSess;
    if (!character || !sessionKey) {
        return false;
    }
    const turnAnswers = gameState.turnAnswers[sessionKey] ?? [];
    const turnSelections = gameState.turnSelections[sessionKey] ?? [];

    return turnSelections.map(selectionKey => turnAnswers[selectionKey]).some(selection => selection.includes(key));
}

export const getReviewOptions = (charCode: string, isAdmin: boolean = false, onlyKey?: string) => {
    const prefix = isAdmin ? 'admin' : 'client';

    const charSess = getCharacterAndSessionKey(charCode);

    if (!charSess) {
        return [];
    }
    const { character, sessionKey } = charSess;
    if (!character || !sessionKey) {
        return [];
    }
    const turnAnswers = gameState.turnAnswers[sessionKey] ?? {};
    const turnSelections = gameState.turnSelections[sessionKey] ?? [];

    let reviewOptions: DropdownListOption[] = [];

    // reaction

    reviewOptions.push({
        label: 'Reaction',
        key: 'reaction',
        value: 'reaction',
        description: turnSelections.filter(key => key.startsWith('client/turn/reaction')).map(key => {
            const orderSegment = getPathOrder(key, sessionKey);
            const reaction = orderSegment?.type === 'select' ? orderSegment.options.find(option => option.value === turnAnswers[key])?.label : turnAnswers[key];
            return `${orderSegment?.title ?? key} - ${reaction}`
        }).join('::')
    });

    // action1

    if (checkForSpecialKeyResponse(charCode, specialKeys.actImmediately)) {
        reviewOptions.push({
            label: 'Immediate Action',
            key: 'action1',
            value: 'action1',
            description: turnSelections.filter(key => key.startsWith('client/turn/action')).map(key => {
                const orderSegment = getPathOrder(key, sessionKey);
                const action = orderSegment?.type === 'select' ? orderSegment.options.find(option => option.value === turnAnswers[key])?.label : turnAnswers[key];
                return `${orderSegment?.title ?? key} - ${action}`
            }).join('::')
        });
    }

    if (!checkForSpecialKeyResponse(charCode, specialKeys.actImmediately)) {
        reviewOptions.push({
            label: 'Move Prior to Action',
            key: 'move1',
            value: 'move1',
            description: turnSelections.filter(key => key.startsWith('client/turn/move1')).map(key => {
                const orderSegment = getPathOrder(key, sessionKey);
                const move = orderSegment?.type === 'select' ? orderSegment.options.find(option => option.value === turnAnswers[key])?.label : turnAnswers[key];
                return `${orderSegment?.title ?? key} - ${move}`
            }).join('::')
        });
    }

    if (!checkForSpecialKeyResponse(charCode, specialKeys.actImmediately)) {
        reviewOptions.push({
            label: 'Action After Move',
            key: 'action2',
            value: 'action2',
            description: turnSelections.filter(key => key.startsWith('client/turn/action')).map(key => {
                const orderSegment = getPathOrder(key, sessionKey);
                const action = orderSegment?.type === 'select' ? orderSegment.options.find(option => option.value === turnAnswers[key])?.label : turnAnswers[key];
                return `${orderSegment?.title ?? key} - ${action}`
            }).join('::')
        });
    }

    reviewOptions.push({
        label: 'Move After Action',
        key: 'move2',
        value: 'move2',
        description: turnSelections.filter(key => key.startsWith('client/turn/move2')).map(key => {
            const orderSegment = getPathOrder(key, sessionKey);
            const move = orderSegment?.type === 'select' ? orderSegment.options.find(option => option.value === turnAnswers[key])?.label : turnAnswers[key];
            return `${orderSegment?.title ?? key} - ${move}`
        }).join('::')
    });

    return reviewOptions;
}

const getHeaderAndFooter = (info: ProcessedParams) => {
    return {
        header: {
            title: info.character?.name ?? 'ERROR',
            subtitle: gameState.name,
            playerSwitch: getMySessionKeyGroup(info.sessionKey).map(key => getCharacterFromSessionKey(key).character)
                .filter(character => character !== null && character.key !== info.character?.key)
                .map(character => ({
                    label: character!.name,
                    characterKey: character!.key
                }))
        },
        footer: {
            htmlLink: (process.env.API_BASE ?? 'https://api.d20init.com') + (info.character?.htmlLink ?? '/html/index.html'),
        }
    }
}

export const processClient = (params: Params, processedParams?: ProcessedParams): ClientResponse | BasicResponse | undefined => {
    const info = processedParams ?? processParams(params);
    if (info.layout !== 'client' || !info.sessionKey) {
        return {
            layout: 'basic',
            content: {
                type: 'info',
                title: 'Forbidden',
                subtitle: 'Path processing error',
                linkButtons: [{
                    label: 'Home',
                    href: '/',
                    theme: 'primary'
                }]
            }
        }
    }
    if (!info.character) {
        return {
            layout: 'basic',
            content: {
                type: 'info',
                title: 'Forbidden',
                subtitle: 'You must select a character before you can continue',
                linkButtons: [{
                    label: 'Home',
                    href: '/',
                    theme: 'primary'
                }, {
                    label: 'Select Character',
                    href: '/character',
                    theme: 'action'
                }]
            }
        }
    }
    if (info.section !== 'turn') {
        return {
            layout: 'basic',
            content: {
                type: 'info',
                title: 'Forbidden',
                subtitle: 'Subpath processing error',
                linkButtons: [{
                    label: 'Home',
                    href: '/',
                    theme: 'primary'
                }, {
                    label: 'Your Turn',
                    href: 'client/turn',
                    theme: 'action'
                }]
            }
        }
    }
    if (info.phase === 'review' && info.pathSegments.length === 3) {
        return {
            layout: 'client',
            content: {
                type: 'dropdownList',
                key: 'review',
                title: 'Review Your Turn',
                description: "What the GM Sees",
                options: getReviewOptions(info.character!.key),
                linkButtons: [{
                    label: 'Finalize Turn',
                    href: '/client/turn/review/finish',
                    theme: 'action'
                }]
            },
            phaseSelect: phaseSelect,
            ...getHeaderAndFooter(info),
        }
    }
    if (info.phase === 'review' && info.pathSegments[3] === 'finish') {
        return {
            layout: 'client',
            content: {
                type: 'select',
                key: 'finish',
                title: 'Review Your Turn',
                description: "Mark Your Turn as Finished",
                instantSubmit: true,
                options: [{
                    label: 'Turn is Ready',
                    description: 'You can undo this',
                    key: specialKeys.ordersReady,
                    value: specialKeys.ordersReady,
                }, {
                    label: 'Turn is Not Ready',
                    key: specialKeys.ordersNotReady,
                    value: specialKeys.ordersNotReady,
                }]
            },
            phaseSelect: phaseSelect,
            ...getHeaderAndFooter(info),
        }
    }
    const order = info.orderStep;
    if (order && (order.type === 'select' || order.type === 'dropdownList')) {
        if (gameState.turnAnswers[info.sessionKey] === undefined) {
            gameState.turnAnswers[info.sessionKey] = {};
        }
        return {
            layout: 'client',
            content: {...order, savedValue: gameState.turnAnswers[info.sessionKey][info.path]?.split('::') ?? []},
            phaseSelect: phaseSelect,
            ...getHeaderAndFooter(info),
        }
    }
    else if (order && (order.type === 'text' || order.type === 'textarea' || order.type === 'move')) {
        return {
            layout: 'client',
            content: {...order, savedValue: gameState.turnAnswers[info.sessionKey][info.path] ?? undefined},
            phaseSelect: phaseSelect,
            ...getHeaderAndFooter(info),
        }
    }
    else if (order) {
        return {
            layout: 'client',
            content: order,
            phaseSelect: phaseSelect,
            ...getHeaderAndFooter(info),
        }
    }
    return undefined;
}