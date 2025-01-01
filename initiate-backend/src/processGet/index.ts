import { GetResponse } from "../../../initiate-client/src/QueryTypes/getResponse";

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
        return {
            layout: 'basic',
            content: {
                type: 'select',
                title: 'Select Character',
                subtitle: 'Select a character to view',
                multiSelect: true,
                poll: true,
                options: [{ label: 'Character 1', 
                    value: 'character1', 
                    theme: 'primary',
                    description: 'Description 1',
                    longDescription: '<h2>Character 1</h2><p>Description 1</p><p>Description 2</p>'
                }, { label: 'Character 2', value: 'character2', theme: 'primary', description: 'Description 2', longDescription: '<h2>Character 2</h2><p>Description 1</p><p>Description 2</p>' }, { label: 'Character 3', value: 'character3', theme: 'primary', disabled: true, description: 'Description 3', longDescription: '<h2>Character 3</h2><p>Description 1</p><p>Description 2</p>' }]
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