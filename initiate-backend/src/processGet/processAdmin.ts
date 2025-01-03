import { adminModeSelect, adminPhaseSelectPlay, adminPhaseSelectTurn, gameState } from ".."
import { GetResponse } from "../../../initiate-client/src/QueryTypes/getResponse"
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
            title: 'Admin',
            subtitle: gameState.turnOpen ? 'Turn Is Open' : 'Turn Is Closed',
            playerSwitch: getMyAdminKeyGroup(info.sessionKey).filter(key => gameState.characters.assigned[key]).map(key => gameState.characters.assigned[key]).map(character => ({
                label: character.name,
                characterKey: character.key,
            })),
        },
        footer: {
            htmlLink: '/html/index.html'
        }
    }
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
            layout: 'admin',
            content: {
                type: 'redirect',
                href: '/admin/adjudicate'
            }
        }
    }
    if (info.section === 'play' && ['reaction', 'action1', 'move1', 'action2', 'move2'].includes(info.phase ?? '__null__')) {
        console.log('section == play', info.phase);
        if (['reaction', 'move2'].includes(info.pathSegments[2])) {
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
                        description: gameState.turnSelections[key].filter(stepKey => stepKey.includes('turn/' + info.pathSegments[2])).map(stepKey => stepKey.split('/')[stepKey.split('/').length - 1] + ': ' + gameState.turnAnswers[key][stepKey]).join('::'),
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
                        description: gameState.turnSelections[key].filter(stepKey => stepKey.includes('turn/action1')).map(stepKey => stepKey.split('/')[stepKey.split('/').length - 1] + ': ' + gameState.turnAnswers[key][stepKey]).join('::'),
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
                    options: Object.entries(gameState.characters.assigned).filter(([key, character]) => !actImmediately(key)).map(([key, character]) => ({
                        label: character.name,
                        description: gameState.turnSelections[key].filter(stepKey => stepKey.includes('turn/' + info.pathSegments[2])).map(stepKey => stepKey.split('/')[stepKey.split('/').length - 1] + ': ' + gameState.turnAnswers[key][stepKey]).join('::'),
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
                layout: 'client',
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
            let newPath = info.path.split('/').slice(0, -1).join('/');
            if (newPath.length < 3) {
                newPath = '/admin/turn/reaction';
            }
            return {
                layout: 'admin',
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
                content: {
                    type: 'info',
                    title: 'No character found',
                    linkButtons: [{
                        label: 'Adjudicate',
                        href: '/admin/adjudicate',
                        theme: 'primary'
                    }]
                }
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