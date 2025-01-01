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
                linkButtons: [{ label: 'Join Game', href: '/client/join', theme: 'action' }, { label: 'Create Game', href: '/gm/create', theme: 'secondary' }]
            }
        }
    }
    else if (path === 'client/join') {
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
    else if (path === 'client/character') {

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