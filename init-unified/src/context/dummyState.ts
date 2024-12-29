
export const dummyState = {
    activeAdmin: false,
    adminState: {
        phase: 'move1'
    },
    playerStates: {
        'red-fighter': {
            openKey: 'base.reaction'
        }
    },
    playerTurnStates: {
        'red-fighter': {}
    },
    adminSession: 'f2e5401f-59d5-405c-9c8e-800f293a9f91',
    playerSession: 'dbd02e59-cf80-428c-8219-3341c005865f',
    playerIds: ['red-fighter', 'blue-fighter'],
    currentPlayerId: 'red-fighter',
    orderOptions: {
        'red-fighter': {
            label: 'Orders for Turn',
            key: 'base',
            type: 'select',
            options: [
                {
                    label: 'Reaction', key: 'reaction', value: 'reaction', type: 'select',
                    options: [
                        { label: 'Yes', key: 'yes', value: 1 },
                        { label: 'No', key: 'no', value: 0 }
                    ]
                },
                { label: 'Move 1', key: 'move1', value: 'move1' },
                { label: 'Action', key: 'action', value: 'action' },
                { label: 'Bonus Action', key: 'bonusAction', value: 'bonusAction' },
                { label: 'Move 2', key: 'move2', value: 'move2' }
            ]
        }
    }
}