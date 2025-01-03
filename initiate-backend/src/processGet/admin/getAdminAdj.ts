import { GetResponse, SelectOption } from "../../../../initiate-client/src/QueryTypes/getResponse";
import { Params } from "..";
import { adminModeSelect, adminPhaseSelectTurn, gameState } from "../..";
import { specialKeys } from "../../consts";
import { ThemeOption } from "../../../../initiate-client/src/types";

export const findSpecialKeysForChar = (characterKey: string) => {
    const sessionKey = Object.entries(gameState.characters.assigned).find(([k, v]) => v.key === characterKey)?.[0];
    if (!sessionKey) {
        console.error('Character not found');
        return [];
    }
    return Object.entries(specialKeys).filter(([k, v]) => Object.values(gameState.turnAnswers[sessionKey] ?? {}).find(v => v.includes(k))).map(([k, v]) => v);
}

export const characterTurnReady = (characterKey: string) => {
    const characterSpecialKeys = findSpecialKeysForChar(characterKey);
    console.log('characterSpecialKeys', characterSpecialKeys, 'specialKeys.ordersReady', specialKeys.ordersReady);
    const ready = !!characterSpecialKeys.includes(specialKeys.ordersReady);
    console.log('ready', ready);
    return ready;
}

export const getAdminAdj = (params: Params): GetResponse => {
    const path = decodeURIComponent(params.path);
    const pathSegments = path.split('/');
    const sessionKey = decodeURIComponent(params.sessionKey);

    if (gameState.adminKey !== sessionKey || pathSegments.length < 2 || pathSegments[0] !== 'admin' || pathSegments[1] !== 'adjudicate') {
        return {
            layout: 'basic',
            content: {
                type: 'info',
                title: 'Oops!',
                subtitle: 'You are not the admin of this game.',
                description: 'Please check your address and try again.',
                linkButtons: [{ label: 'Go to Home', href: '/', theme: 'secondary' }, { label: 'Your Turn', href: '/client/turn', theme: 'action' }]
            }
        }
    }
    else if (pathSegments.length === 2 && pathSegments[1] === 'adjudicate') {
        console.log('admin/adjudicate', gameState.turnOpen);
        if (gameState.turnOpen) {
            console.log('turnOpen');
            return {
                layout: 'admin',
                content: {
                    type: 'select',
                    title: 'Adjudicate',
                    subtitle: 'Turn Is Open',
                    key: specialKeys.adjudicatePage,
                    poll: true,
                    options: [...Object.values(gameState.characters.assigned).sort((a, b) => a.name.localeCompare(b.name)).map(c => {
                        const characterSpecialKeys = findSpecialKeysForChar(c.key);
                        return {
                            label: c.name,
                            subtitle: c.description,
                            value: c.key,
                            key: c.key,
                            theme: characterTurnReady(c.key) ? 'action' : 'destructive' as ThemeOption,
                        }
                    }), {
                        label: 'Close Turn',
                        description: Object.values(gameState.characters.assigned).every(c => characterTurnReady(c.key)) ? 'All players are ready' : 'Turns are incomplete',
                        value: specialKeys.closeTurn,
                        key: specialKeys.closeTurn,
                        theme: Object.values(gameState.characters.assigned).every(c => characterTurnReady(c.key)) ? 'action' as ThemeOption : 'destructive' as ThemeOption,
                    }]
                },
                adminModeSelect: adminModeSelect
            }
        }
        else {
            return {
                layout: 'admin',
                content: {
                    type: 'select',
                    title: 'Turn Closed',
                    subtitle: 'Turn is closed',
                    description: 'Turn is closed, you can no longer adjudicate.',
                    key: 'closeTurn',
                    options: [{
                        label: 'Open Current Turn',
                        value: specialKeys.openTurn,
                        key: specialKeys.openTurn,
                        theme: 'action' as ThemeOption
                    }, {
                        label: 'Next Turn',
                        value: specialKeys.nextTurn,
                        key: specialKeys.nextTurn,
                        theme: 'action' as ThemeOption
                    }]
                },
                adminModeSelect: adminModeSelect
            }
        }
    }
    else if (pathSegments.length === 3 && pathSegments[1] === 'adjudicate') {
        const characterKey = pathSegments[2];
        const character = Object.values(gameState.characters.assigned).find(c => c.key === characterKey);
        if (!character) {
            return {
                layout: 'basic',
                content: {
                    type: 'info',
                    title: 'Oops!',
                    subtitle: 'Lost in the astral plane',
                    description: 'Character not found',
                    linkButtons: [{ label: 'Admin Home', href: '/admin/adjudicate', theme: 'action' }, { label: 'App Root', href: '/', theme: 'destructive' }]
                }
            }
        }
        return {
            layout: 'admin',
            content: {
                type: 'select',
                title: 'Manage Player',
                key: 'manage',
                options: [{
                    label: 'Remove Player',
                    value: `${specialKeys.removePlayer}::${characterKey}`,
                    key: specialKeys.removePlayer,
                    theme: 'destructive' as ThemeOption
                }, {
                    label: 'Cancel',
                    value: specialKeys.goBack,
                    key: specialKeys.goBack,
                    theme: 'action' as ThemeOption
                }]
            },
            adminModeSelect: adminModeSelect
        }
    }
    return {
        layout: 'basic',
        content: {
            type: 'info',
            title: 'Oops!',
            subtitle: 'Lost in the astral plane',
            linkButtons: [{ label: 'Admin Home', href: '/admin/adjudicate', theme: 'action' }, { label: 'App Root', href: '/', theme: 'destructive' }]
        }
    }
}