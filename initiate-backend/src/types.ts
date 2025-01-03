import { OrderContent } from "../../initiate-client/src/QueryTypes/getResponse";
import { ThemeOption } from "../../initiate-client/src/types";

export type Session = {
    sessionKey: string;
    gameKey: string;
    isAdmin?: boolean;
    currentCharacterKey: string;
}

export type Character = {
    name: string;
    key: string;
    description?: string;
    htmlLink?: string;
    theme?: ThemeOption;
    orderOptions: { [key: string]: OrderContent}
}

export type AdminState = {
    playState: {
        dropDownChecked: {
            reaction: string[]
            action1: string[]
            move1: string[]
            action2: string[]
            move2: string[]
        }
    }
}

export type GameState = {
    active: boolean,
    turn: number,
    turnOpen: boolean,
    name: string,
    adminKeyGroups: string[][],
    keyGroups: string[][],
    turnOrderLists: { [key: string]: TurnOrderList },
    characters: {
        unassigned: Character[],
        assigned: { [key: string]: Character }
    },
    turnPhaseOrder: string[],
    turnAnswers: { [sessionKey: string]: { [key: string]: string } },
    turnSelections: { [sessionKey: string]: string[] }
    adminState: AdminState
}

export type TurnOrderList = {
    initiative: number,
    characterKey: string,
    orders: Orders[]
}

export type Orders = {
    moveImmediately?: boolean,
    reaction?: string,
    movement?: string,
    action?: string,
    bonusAction?: string
    notes?: string
}