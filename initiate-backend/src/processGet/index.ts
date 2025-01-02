import { GetResponse, SelectOption } from "../../../initiate-client/src/QueryTypes/getResponse";
import { getTurn } from "./getTurn";
import { gameState, redisClient, setGameState } from "../index";
import { getHtml } from "./getHtml";

export type Params = {
    sessionKey: string;
    path: string;
}

export const processGet = async (params: Params): Promise<GetResponse> => {
    const path = decodeURIComponent(params.path);
    // console.log('get', path, params.sessionKey);

    if (!gameState.active) {
        if (redisClient?.isReady) {
            const gameStateStore = await redisClient.get('gameState');
            if (gameStateStore) {
                setGameState(JSON.parse(gameStateStore));
            }
        }
    }

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
        if (params.sessionKey) {
            return {
                layout: 'basic',
                content: {
                    type: 'info',
                    title: 'In Game',
                    subtitle: 'You are already in game',
                    linkButtons: [{ label: 'Pick a Character (Will Lose Current)', href: '/basic/join', theme: 'destructive' }, { label: 'Back to Turn', href: '/client/turn', theme: 'action' }]
                }
            }
        }

        return {
            layout: 'basic',
            content: {
                type: 'text',
                key: 'basic',
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
        const characters = [...unassignedCharacters, ...assignedCharacters].sort((a, b) => a.key!.localeCompare(b.key!));
        return {
            layout: 'basic',
            content: {
                type: 'select',
                key: 'character',
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
                key: 'bio',
                title: 'Enter Bio',
                subtitle: 'Enter a bio for your character'
            }
        }
    }

    else if (/^(client|admin)\/turn/.test(path)) {
        if (gameState.turnOpen) {
            return getTurn(params);
        }
        else {
            return {
                layout: 'basic',
                content: {
                    type: 'info',
                    title: 'Turn Closed',
                    subtitle: 'The turn is closed',
                    description: 'The turn is closed. When the next turn opens, click the button below.',
                    linkButtons: [{ label: 'Enter Orders', href: '/client/turn', theme: 'action' }]
                }
            }
        }
    }

    return {
        layout: 'basic',
        content: {
            type: 'info',
            title: 'Route Problem',
            subtitle: 'Something went wrong',
            linkButtons: [{ label: 'Home', href: '/', theme: 'action' }]
        }
    }
}