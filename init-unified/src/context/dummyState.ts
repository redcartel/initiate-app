
export const dummyState = {
    activeAdmin: false,
    adminState: {
        phase: 'move1'
    },
    playerStates: {
        'red-fighter': {
            phase: 'action'
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
            'reaction': {
                label: 'Skip Opportunity Attacks?',
                key: 'skipOpportunityAttacks',
                type: 'select',
                options: [
                    { label: 'Yes', value: 1 },
                    { label: 'No', value: 0 }
                ]
            },
            'move1': null,
            'action': null,
            'bonusAction': null,
            'move2': null
        }
    }
}