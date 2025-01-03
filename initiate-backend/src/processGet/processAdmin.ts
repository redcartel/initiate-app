import { adminModeSelect, adminPhaseSelectPlay, adminPhaseSelectTurn, gameState } from ".."
import { GetResponse, SelectOption } from "../../../initiate-client/src/QueryTypes/getResponse"
import { ThemeOption } from "../../../initiate-client/src/types"
import { specialKeys } from "../consts"
import { ProcessedParams } from "../game-logic/processParams"
import { characterTurnReady, findSpecialKeysForChar } from "./admin/getAdminAdj"
import { HeaderInfo, FooterInfo } from "../../../initiate-client/src/QueryTypes/getResponse"
import { getMyAdminKeyGroup } from "../game-logic/sessionKeys"
import { actImmediately } from "./admin/getAdminPlay"
import { getPathOrder } from "../game-logic/getPathOrder"
import { getReviewOptions } from "./processClient"

export const getAdminHeaderAndFooter = (info: ProcessedParams): { header: HeaderInfo, footer: FooterInfo } => {
    return {
        header: {
            title: info.pathSegments[1] === 'turn' ? info.character?.name ?? '- no character -' : 'Admin',
            subtitle: gameState.turnOpen ? '[Turn Is Open]' : '[Turn Is Closed]',
            playerSwitch: getMyAdminKeyGroup(info.sessionKey).filter(key => gameState.characters.assigned[key]).map(key => gameState.characters.assigned[key]).map(character => ({
                label: character.name,
                characterKey: character.key,
            })),
        },
        footer: {
            htmlLink: info.pathSegments[1] === 'adjudicate' ? '/html/admin/adjudicate/index.html' :     
                      info.pathSegments[1] === 'turn' ? info.character?.htmlLink ?? '/html/index.html' :
                      info.pathSegments[1] === 'play' ? '/html/admin/play/index.html' :
                      info.pathSegments[1] === 'npc' ? '/html/admin/npc/index.html' :
                      '/html/index.html',
            linkName: info.pathSegments[1] === 'adjudicate' ? 'Rule Book' :     
                      info.pathSegments[1] === 'turn' ? info.character?.name ? info.character.name + ' Sheet' : 'Character Sheet' :
                      info.pathSegments[1] === 'play' ? 'Play Guidelines' :
                      info.pathSegments[1] === 'npc' ? 'NPC Guidelines' :
                      'Admin',
        }
    }
}

export const getAdminMenuContent = (info: ProcessedParams) : SelectOption[] => {
    const sessionKeys = getMyAdminKeyGroup(info.sessionKey);
    const characterOptions = Object.entries(gameState.characters.assigned).filter(([key, character]) => sessionKeys.includes(key)).map(([key, character]) => ({
        label: character.name,
        value: specialKeys.switchCharacter + '::' + character.key,
        key: specialKeys.switchCharacter, 
        theme: Object.values(gameState.turnAnswers[key] ?? {}).includes(specialKeys.ordersReady) ? 'tertiary' : 'secondary' as ThemeOption
    }))
    const exitOption = [{
        label: 'Exit Game',
        value: specialKeys.exitGame,
        key: specialKeys.exitGame,
        theme: 'destructive' as ThemeOption
    }]; 
    return [...characterOptions, ...exitOption];
}

const sessionKeyAndStepKeyToText = (sessionKey: string, stepKey: string) => {
    const order = getPathOrder(stepKey, sessionKey);
    if (!order) {
        return { title: stepKey, answer: gameState.turnAnswers[sessionKey][stepKey] ?? 'missing'}
    }
    return { title: order.title, answer: order.type === 'select' ? order.options.find(option => option.value === gameState.turnAnswers[sessionKey][stepKey])?.label : gameState.turnAnswers[sessionKey][stepKey] }
}

export const processAdmin = (info: ProcessedParams): GetResponse => {
    console.log('processAdmin', info);
    if (!info.isAdmin) {
        return {
            'layout': 'basic',
            content: {
                type: 'redirect',
                href: '/basic/' + specialKeys.gameCreate
            }
        }
    }
    if (info.layout !== 'admin') {
        return {
            'layout': 'basic',
            content: {
                type: 'redirect',
                href: '/admin/adjudicate'
            }
        }
    }
    if (info.pathSegments[info.pathSegments.length - 1] === 'HEADERMENU') {
        console.log('HEADERMENU');
        return {
            layout: 'admin',
            content: {
                type: 'select',
                title: 'Switch Character',
                subtitle: 'Select a character to switch to',
                key: 'menu',
                options: getAdminMenuContent(info)
            },
            ...getAdminHeaderAndFooter(info),
            adminModeSelect: adminModeSelect,
        }
    }

    if (info.section === 'adjudicate' && !info.phase) {
        return {
            layout: 'admin',
            content: {
                type: 'select',
                title: 'Adjudicate',
                subtitle: gameState.turnOpen ? 'Turn Is Open' : 'Turn Is Closed',
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
                }), ...(gameState.turnOpen ? [{
                    label: 'Close Turn',
                    description: Object.values(gameState.characters.assigned).every(c => characterTurnReady(c.key)) ? 'All players are ready' : 'Turns are incomplete',
                    value: specialKeys.closeTurn,
                    key: specialKeys.closeTurn,
                    theme: Object.values(gameState.characters.assigned).every(c => characterTurnReady(c.key)) ? 'primary' as ThemeOption : 'destructive' as ThemeOption,
                }] : [{
                    label: 'Open Turn',
                    description: 'Turn is closed',
                    value: specialKeys.openTurn,
                    key: specialKeys.openTurn,
                    theme: 'primary' as ThemeOption,
                }])],
            },
            adminModeSelect: adminModeSelect,
            ...getAdminHeaderAndFooter(info),
        }
    }
    if (gameState.turnOpen && info.section === 'play') {
        return {
            layout: 'basic',
            content: {
                type: 'redirect',
                href: '/admin/adjudicate'
            }
        }
    }
    if (info.section === 'play' && ['reaction', 'action1', 'move1', 'action2', 'move2'].includes(info.phase ?? '__null__')) {
        console.log('section == play', info.phase);


        if (['reaction', 'move2'].includes(info.pathSegments[2])) {
            console.log('reaction or move2');
            return {
                layout: 'admin',
                content: {
                    type: 'dropdownList',
                    title: {
                        reaction: 'Reaction',
                        move2: 'Post-Action Movement'
                    }[info.pathSegments[2]]! as string,
                    key: info.pathSegments[2],
                    savedValue: gameState?.adminState?.playState?.dropDownChecked?.[info.pathSegments[2] as keyof typeof gameState.adminState.playState.dropDownChecked] ?? [],
                    options: Object.entries(gameState.characters.assigned).map(([key, character]) => ({
                        label: character.name,
                        description: gameState.turnSelections[key]
                            .filter(stepKey => stepKey
                            .includes('turn/' + info.pathSegments[2]))
                            .map(stepKey => sessionKeyAndStepKeyToText(key, stepKey))
                            .map(order => order.title + ': ' + order.answer).join('::'),
                        value: character.key,
                        key: character.key,
                        theme: 'primary'
                    }))
                },
                phaseSelect: adminPhaseSelectPlay,
                adminModeSelect: adminModeSelect,
                ...getAdminHeaderAndFooter(info),
            }
        }
        if (['action1'].includes(info.pathSegments[2])) {
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
                        description: gameState.turnSelections[key]
                            .filter(stepKey => stepKey.includes('turn/action1'))
                            .map(stepKey => sessionKeyAndStepKeyToText(key, stepKey))
                            .map(order => order.title + ': ' + order.answer).join('::'),
                        theme: 'primary'
                    }))
                },
                phaseSelect: adminPhaseSelectPlay,
                ...getAdminHeaderAndFooter(info),
            }
        }

        if (['move1', 'action2'].includes(info.pathSegments[2])) {
            return {
                layout: 'admin',
                adminModeSelect: adminModeSelect,
                content: {
                    type: 'dropdownList',
                    title: {
                        move1: 'Early Movement',
                        action2: 'Normal Actions'
                    }[info.pathSegments[2]]! as string,
                    key: info.pathSegments[2],
                    savedValue: gameState?.adminState?.playState?.dropDownChecked?.[info.pathSegments[2] as keyof typeof gameState.adminState.playState.dropDownChecked] ?? [],
                    options: Object.entries(gameState.characters.assigned).filter(([key, character]) => !actImmediately(key))
                        .map(([key, character]) => ({
                        label: character.name,
                        description: gameState.turnSelections[key]
                            .filter(stepKey => stepKey.includes('turn/' + info.pathSegments[2]))
                            .map(stepKey => sessionKeyAndStepKeyToText(key, stepKey))
                            .map(order => order.title + ': ' + order.answer).join('::'),
                        value: character.key,
                        key: character.key,
                        theme: 'primary'
                    }))
                },
                phaseSelect: adminPhaseSelectPlay,
                ...getAdminHeaderAndFooter(info),
            }
        }
    }
    else if (info.section === 'play' && !info.phase) {
        return {
            layout: 'basic',
            content: {
                type: 'redirect',
                href: '/admin/play/reaction'
            }
        }
    }
    else if (info.section === 'turn' && info.phase === 'review') {
        if (info.phase === 'review' && info.pathSegments.length === 3) {
            return {
                layout: 'admin',
                content: {
                    type: 'dropdownList',
                    key: 'review',
                    title: 'Review Your Turn',
                    description: "What the GM Sees",
                    options: getReviewOptions(info.character!.key),
                    linkButtons: [{
                        label: 'Finalize Turn',
                        href: '/admin/turn/review/finish',
                        theme: 'action'
                    }]
                },
                adminModeSelect: adminModeSelect,
                phaseSelect: adminPhaseSelectTurn,
                ...getAdminHeaderAndFooter(info),
            }
        }
    }
    else if (info.section === 'turn' && info.phase) {
        const order = getPathOrder(info.path, info.sessionKey);
        if (order) {
            return {
                layout: 'admin',
                content: order,
                adminModeSelect: adminModeSelect,
                ...getAdminHeaderAndFooter(info),
                phaseSelect: adminPhaseSelectTurn,
            }
        }
        else if (info.character) {
            let newPath = '/' +info.path.split('/').slice(0, -1).join('/');
            if (newPath.length < 3) {
                newPath = '/admin/turn/reaction';
            }
            return {
                layout: 'admin',
                adminModeSelect: adminModeSelect,
                content: {
                    type: 'info',
                    title: 'No order found',
                    subtitle: 'No order found for ' + info.path,
                    linkButtons: [{
                        label: 'Back',
                        href: newPath,
                        theme: 'primary'
                    }]
                }
            }
        }
        else {
            return {
                layout: 'admin',
                adminModeSelect: adminModeSelect,
                content: {
                    type: 'info',
                    title: 'No character found',
                    linkButtons: [{
                        label: 'Adjudicate',
                        href: '/admin/adjudicate',
                        theme: 'primary'
                    }]
                },
                ...getAdminHeaderAndFooter(info)
            }
        }
    }
    if (info.section === 'npc') {
        return {
            layout: 'admin',
            content: {
                type: 'select',
                title: 'Add NPC to Control',
                subtitle: 'Multiple Selections Allowed',
                multiSelect: true,
                multiMin: 1,
                key: 'npcs',
                options: Object.entries(gameState.characters.unassigned).map(([key, character]) => ({
                    label: character.name,
                    value: `${specialKeys.addCharacter}::${character.key}`,
                    key: `${specialKeys.addCharacter}::${character.key}`,
                    theme: 'primary'
                }))
            },
            adminModeSelect: adminModeSelect,
            ...getAdminHeaderAndFooter(info),
        }
    }
    return {
        layout: 'basic',
        content: {
            type: 'redirect',
            href: '/admin/adjudicate'
        }
    }
}