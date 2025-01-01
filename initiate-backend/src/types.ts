import { OrderContent } from "../../initiate-client/src/QueryTypes/getResponse";

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
    longDescription?: string;
    orderOptions: { [key: string]: OrderContent}
}

export type GameState = {
    turn: number,
    name: string,
    turnOrderLists: { [key: string]: TurnOrderList },
    adminKey?: string,
    characters: {
        unassigned: Character[],
        assigned: { [key: string]: Character }
    }
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