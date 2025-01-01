import { GetResponse, SelectOption } from "../../../initiate-client/src/QueryTypes/getResponse";
import { getTurn } from "./getTurn";
import { gameState } from "../index";

export type Params = {
    sessionKey: string;
    path: string;
}

export const processGet = (params: Params): GetResponse => {
    const path = decodeURIComponent(params.path);
    console.log('get', path, params.sessionKey);

    if (path === '') {
        return {
            layout: 'basic',
            content: {
                type: 'info',
                logo: true,
                title: 'Initiate!',
                subtitle: 'Companion App for D20 Tactics',
                linkButtons: [{ label: 'Join Game', href: '/basic/join', theme: 'action' }, { label: 'Create Game', href: '/basic/game-create', theme: 'secondary' }]
            }
        }
    }
    else if (path === 'basic/join') {
        console.log('join', params.sessionKey);
        return {
            layout: 'basic',
            content: {
                type: 'text',
                title: 'Enter Game Code',
                subtitle: 'Or ask the GM for a link'
            }
        }
    }
    else if (path === 'basic/character') {
        const unassignedCharacters : SelectOption[] = gameState.characters.unassigned.map(c => {
            return {
                label: c.name,
                value: c.key,
                key: c.key,
                theme: 'secondary',
                description: c.description,
                longDescription: c.longDescription,
                disabled: false
            }
        });
        console.log('unassignedCharacters', unassignedCharacters);
        const assignedCharacters : SelectOption[] = Object.values(gameState.characters.assigned).map(c => {
            return {
                label: c.name,
                value: c.key,
                key: c.key,
                theme: 'secondary',
                description: c.description,
                longDescription: c.longDescription,
                disabled: true
            }
        });
        console.log('assignedCharacters', assignedCharacters);
        const characters = [...unassignedCharacters, ...assignedCharacters].sort((a, b) => a.key!.localeCompare(b.key!));
        console.log('characters', characters);
        return {
            layout: 'basic',
            content: {
                type: 'select',
                title: 'Select Character',
                subtitle: 'Select a character to view',
                poll: true,
                options: characters
            }
        }
    }
    else if (path === 'basic/bio') {
        return {
            layout: 'basic',
            content: {
                type: 'textarea',
                title: 'Enter Bio',
                subtitle: 'Enter a bio for your character'
            }
        }
    }

    else if (/^client\/turn/.test(path)) {
        return getTurn(params);
    }

    return {
        layout: 'basic',
        content: {
            type: 'info',
            logo: true,
            title: 'Initiate!',
            subtitle: 'Companion App for D20 Tactics',
            linkButtons: [{ label: 'Join Game', href: '/client/join', theme: 'action' }, { label: 'Create Game', href: '/gm/create', theme: 'secondary' }]
        }
    }
}