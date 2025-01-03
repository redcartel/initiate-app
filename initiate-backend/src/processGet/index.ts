import { GetResponse, SelectOption, BasicResponse, InfoContent, OrderContent } from "../../../initiate-client/src/QueryTypes/getResponse";
import { gameState, redisClient, setGameState } from "../index";
import { getAdminAdj } from "./admin/getAdminAdj";
import { getAdminPlay } from "./admin/getAdminPlay";
import { ProcessedParams, processParams } from "../game-logic/processParams";
import { specialKeys } from "../consts";
import { processClient } from "./processClient";
import { processAdmin } from "./processAdmin";

const baseUrl = process.env.API_BASE ?? 'https://api.d20init.com';

export type Params = {
    sessionKey: string;
    path: string;
}

export const processGet = async (params: Params, processedParams?: ProcessedParams) : Promise<GetResponse<OrderContent>> => {
    const info = processedParams ?? processParams(params);
    if (info.forbidden) {
        return {
            layout: 'basic',
            content: {
                type: 'redirect',
                href: info.forbiddenRedirect ?? '/'
            },
            errorMsg: info.forbiddenErrorMsg ?? 'You are not authorized to access this page'
        }
    }


    // if (!info.sessionKey && info.forbidden) {
    //     return {
    //         layout: 'basic',
    //         content: {
    //             type: 'info',
    //             title: 'Forbidden',
    //             subtitle: 'You do not have a session',
    //             linkButtons: [{ label: 'App Root', href: info.forbiddenRedirect ?? '/', theme: 'primary' }]
    //         }
    //     }
    // }
    // else if (info.needCharacter && info.forbidden && !info.isAdmin) {
    //     return {
    //         layout: 'basic',
    //         content: {
    //             type: 'info',
    //             title: 'Forbidden',
    //             subtitle: 'You must pick a character before you can continue',
    //             linkButtons: [{ label: 'App Root', href: '/', theme: 'primary' }, { label: 'Pick a Character', href: info.forbiddenRedirect ?? '/basic/character', theme: 'action' }]
    //         }
    //     }
    // }
    // else if (info.character && !info.isAdmin && info.forbidden) {
    //     return {
    //         layout: 'basic',
    //         content: {
    //             type: 'info',
    //             title: 'Forbidden',
    //             subtitle: 'You cannot access this page as a player',
    //             linkButtons: [{ label: 'App Root', href: '/', theme: 'primary' }, { label: 'Your Turn', href: '/client/turn', theme: 'action' }]
    //         }
    //     }
    // }
    // else if (info.forbidden && info.isAdmin) {
    //     return {
    //         layout: 'basic',
    //         content: {
    //             type: 'info',
    //             title: 'Forbidden',
    //             subtitle: 'You cannot access this page as a GM',
    //             linkButtons: [{ label: 'App Root', href: '/', theme: 'primary' }, { label: 'GM View', href: '/admin/adjudicate', theme: 'action' }]
    //         }
    //     }
    // }
    
    const welcome = {
        layout: 'basic',
        content: {
            type: 'info',
            logo: true,
            title: 'Initiate!',
            subtitle: 'Companion App for D20 Tactics',
            linkButtons: [{ label: 'Player', href: '/basic/' + specialKeys.join, theme: 'action' }, { label: 'GM', href: '/basic/' + specialKeys.gameCreate, theme: 'destructive' }]
        }
    }

    if (info.layout === 'client') {
        const clientResponse = processClient(params, info);
        if (clientResponse) {
            return clientResponse;
        }
    }
    else if (info.layout === 'admin') {
        const adminResponse = processAdmin(info);
        if (adminResponse) {
            return adminResponse;
        }
    }

    if (info.path === '' || info.path === 'basic') {
        return welcome as BasicResponse;
    }

    if (info.layout === 'basic' && info.section === specialKeys.join) {
        return {
            layout: 'basic',
            content: {
                type: 'text',
                key: specialKeys.join,
                title: 'Enter Game Code',
                subtitle: 'Or ask the GM for a link'
            }
        }
    }
    if (info.layout === 'basic' && info.section === specialKeys.gameCreate) {
        return {
            layout: 'basic',
            content: {
                type: 'text',
                key: specialKeys.gameCreate,
                title: 'Enter Admin Invite Key',
            }
        }
    }
    if (info.layout === 'basic' && info.section === 'character') {
        const unassignedCharacters : SelectOption[] = gameState.characters.unassigned.filter(c => !c.npcOnly).map(c => {
            return {
                label: c.name,
                value: `${specialKeys.pickCharacter}::${c.key}`,
                key: c.key,
                theme: c.theme ?? 'primary',
                description: c.description,
                htmlLink: c.htmlLink ? baseUrl + c.htmlLink : undefined,
                disabled: false
            }
        });
        const assignedCharacters : SelectOption[] = Object.values(gameState.characters.assigned).filter(c => !c.npcOnly).map(c => {
            return {
                label: c.name,
                value: c.key,
                key: c.key,
                theme: 'tertiary',
                description: c.description,
                htmlLink: c.htmlLink ? baseUrl + c.htmlLink : undefined,
                disabled: true
            }
        });

        return {
            layout: 'basic',
            content: {
                type: 'select',
                key: specialKeys.pickCharacter,
                title: 'Select Character',
                subtitle: 'Select a character to play',
                poll: true,
                options: [...unassignedCharacters, ...assignedCharacters].sort((a, b) => a.key!.localeCompare(b.key!))
            }
        };
    }
    
    let clientAdminResponse : OrderContent | undefined;

    if (info.character && !info.isAdmin) {
        return {
            layout: 'basic',
            content: {
                type: 'redirect',
                href: '/client/turn/' + gameState.turnPhaseOrder[0]
            },
            errorMsg: 'FELL THROUGH CODE WITH CHARACTER, OOPS'
        }
    }

    if (info.sessionKey && !info.isAdmin) {
        return {
            layout: 'basic',
            content: {
                type: 'redirect',
                href: '/basic/character'
            },
            errorMsg: 'FELL THROUGH CODE WITH SESSION KEY, OOPS'
        }
    }

    info.forbidden = true;
    if (!processedParams) {
        return processGet(params, info);
    }

    console.log('===> FELL THROUGH BOTTOM <==');
    return {
        layout: 'basic',
        content: {
            type: 'redirect',
            href: '/basic/join',
        },
        errorMsg: 'FELL THROUGH BOTTOM OF CODE, OOPS!'
    }
}