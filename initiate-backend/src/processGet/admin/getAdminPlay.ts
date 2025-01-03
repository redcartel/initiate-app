import { Params } from "..";
import { adminModeSelect, gameState } from "../..";
import { AdminResponse } from "../../../../initiate-client/src/QueryTypes/getResponse";
import { adminPhaseSelectTurn } from "../..";
import { specialKeys } from "../../consts";
import { channel } from "diagnostics_channel";

export const actImmediately = (sessionKey: string) => {
    const actImmediatelyKey = specialKeys.actImmediately
    return !!Object.values(gameState.turnAnswers[sessionKey]).find(answer => answer === actImmediatelyKey)
}

export const readyAction = (sessionKey: string) => {
    const readyActionKey = specialKeys.reactionReadyAction
    return !!Object.values(gameState.turnAnswers[sessionKey]).find(answer => answer === readyActionKey)
}

export const getAdminPlay = (params: Params) : AdminResponse => {
    const path = decodeURIComponent(params.path);
    const pathSegments = path.split('/');
    const sessionKey = decodeURIComponent(params.sessionKey);
    if (!gameState.adminKey || gameState.adminKey !== sessionKey) {
        return {
            layout: 'admin',
            content: {
                type: 'info',
                title: 'Unauthorized',
                linkButtons: [{
                    label: 'Home',
                    href: '/',
                    theme: 'primary'
                }]
            }
        }
    }
    if (!gameState.active) {
        return {
            layout: 'admin',
            content: {
                type: 'info',
                title: 'Game Not Active',
                linkButtons: [{
                    label: 'Adjudicate',
                    href: '/admin/adjudicate',
                    theme: 'primary'
                }, {
                    label: 'App Root',
                    href: '/',
                    theme: 'secondary'
                }]
            }
        }
    }
    if (pathSegments.length === 0) {
        return {
            layout: 'admin',
            content: {
                type: 'info',
                title: 'Play',
                linkButtons: [
                    {
                        label: 'Adjudicate',
                        href: '/admin/adjudicate',
                        theme: 'primary'
                    },
                    {
                        label: 'App Root',
                        href: '/',
                        theme: 'secondary'
                    }]
            }
        }
    }
    if (pathSegments.length < 3) {
        return {
            layout: 'admin',
            content: {
                type: 'info',
                title: 'Play',
                linkButtons: [
                    {
                        label: 'Adjudicate',
                        href: '/admin/adjudicate',
                        theme: 'primary'
                    },
                    {
                        label: 'App Root',
                        href: '/',
                        theme: 'secondary'
                    }]
            }
        }
    }
    if (pathSegments[0] !== 'admin' || pathSegments[1] !== 'play') {
        return {
            layout: 'admin',
            content: {
                type: 'info',
                title: 'Invalid Path',
                linkButtons: [
                    {
                        label: 'Adjudicate',
                        href: '/admin/adjudicate',
                        theme: 'primary'
                    },
                    {
                        label: 'App Root',
                        href: '/',
                        theme: 'secondary'
                    }]
            },
            adminModeSelect: adminModeSelect
        }
    }
    if (['reaction','move2'].includes(pathSegments[2])) {
        return {
            layout: 'admin',
            adminModeSelect: adminModeSelect,
            content: {
                type: 'dropdownList',
                title: {
                    reaction: 'Reaction',
                    move2: 'Post-Action Movement'
                }[pathSegments[2]]! as string,
                key: pathSegments[2],
                savedValue: gameState?.adminState?.playState?.dropDownChecked?.[pathSegments[2] as keyof typeof gameState.adminState.playState.dropDownChecked] ?? [],
                options: Object.entries(gameState.characters.assigned).map(([key, character]) => ({
                    label: character.name,
                    description: gameState.turnSelections[key].filter(stepKey => stepKey.includes('turn/' + pathSegments[2])).map(stepKey => stepKey.split('/')[stepKey.split('/').length -1] + ': ' + gameState.turnAnswers[key][stepKey]).join('::'),
                    value: character.key,
                    key: character.key,
                    theme: 'primary'
                }))
            },
            phaseSelect: adminPhaseSelectTurn
        }
    }
    if (['action1'].includes(pathSegments[2])) {
        return {
            layout: 'admin',
            adminModeSelect: adminModeSelect,
            content: {
                type: 'dropdownList',
                title: 'Immediate Actions',
                key: 'action1',
                savedValue: gameState?.adminState?.playState?.dropDownChecked?.action1 ?? [],
                options: Object.entries(gameState.characters.assigned).filter(([key, character]) => actImmediately(key)).map(([key, character]) => ({
                    label: character.name,
                    value: character.key,
                    key: character.key,
                    description: gameState.turnSelections[key].filter(stepKey => stepKey.includes('turn/action1')).map(stepKey => stepKey.split('/')[stepKey.split('/').length -1] + ': ' + gameState.turnAnswers[key][stepKey]).join('::'),
                    theme: 'primary'
                }))
            },
            phaseSelect: adminPhaseSelectTurn
        }
    }

    if (['move1', 'action2'].includes(pathSegments[2])) {
        return {
            layout: 'admin',
            adminModeSelect: adminModeSelect,
            content: {
                type: 'dropdownList',
                title: {
                    move1: 'Early Movement',
                    action2: 'Normal Actions'
                }[pathSegments[2]]! as string,
                key: pathSegments[2],
                savedValue: gameState?.adminState?.playState?.dropDownChecked?.[pathSegments[2] as keyof typeof gameState.adminState.playState.dropDownChecked] ?? [],
                options: Object.entries(gameState.characters.assigned).filter(([key, character]) => !actImmediately(key)).map(([key, character]) => ({
                    label: character.name,
                    description: gameState.turnSelections[key].filter(stepKey => stepKey.includes('turn/' + pathSegments[2])).map(stepKey => stepKey.split('/')[stepKey.split('/').length -1] + ': ' + gameState.turnAnswers[key][stepKey]).join('::'),
                    value: character.key,
                    key: character.key,
                    theme: 'primary'
                }))
            },
            phaseSelect: adminPhaseSelectTurn
        }
    }
    return {
        layout: 'admin',
        adminModeSelect: adminModeSelect,
        content: {
            type: 'info',
            title: 'Invalid Path',
            linkButtons: [
                {
                    label: 'Adjudicate',
                    href: '/admin/adjudicate',
                    theme: 'primary'
                }, 
                {
                    label: 'App Root',
                    href: '/',
                    theme: 'secondary'
                }]
        }
    }
}