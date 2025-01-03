import { Params } from "..";
import { adminModeSelect, gameState } from "../..";
import { AdminResponse } from "../../../../initiate-client/src/QueryTypes/getResponse";

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
    if (pathSegments[2] === 'reaction') {
        return {
            layout: 'admin',
            adminModeSelect: adminModeSelect,
            content: {
                type: 'dropdownList',
                title: 'Character Reactions',
                key: 'reaction',
                savedValue: gameState?.adminState?.playState?.dropDownChecked?.reaction ?? [],
                options: Object.entries(gameState.characters.assigned).map(([key, character]) => ({
                    label: character.name,
                    description: gameState.turnSelections[key].filter(stepKey => stepKey.includes('turn/reaction')).map(stepKey => stepKey.split('/')[stepKey.split('/').length -1] + ': ' + gameState.turnAnswers[key][stepKey]).join('::'),
                    value: character.key,
                    key: character.key,
                    theme: 'primary'
                }))
            }
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