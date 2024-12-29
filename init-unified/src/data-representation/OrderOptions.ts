import { evalExpression } from "./logicStack";

/* eslint-disable @typescript-eslint/no-explicit-any */
type OrderOptionArgs = {
    keyPrefix?: string,
    label: string,
    description?: string,
    key: string,
    type?: 'text' | 'select' | 'movement',
    ifCond?: any,
    followUp?: any,
    ifFn?: (state: any, prefix: string) => boolean,
    followUpOption?: OrderOption
}

type OrderSelectionArgs = {
    key: string,
    keyPrefix?: string,
    label: string,
    description?: string,
    value: string,
    keyValues?: {
        [key: string]: string | number
    },
    followUp?: any,
    ifCond?: any,
    disabled?: boolean,
    ifFn?: (state: any, prefix: string) => boolean,
    followUpOption?: OrderOption
}

export class OrderSelection {
    public key: string;

    constructor(public vals: OrderSelectionArgs) {
        this.vals = vals;
        this.key = vals.keyPrefix ? `${vals.keyPrefix}.${vals.key}` : vals.key;
    }
}

export class OrderOption {
    public key: string;

    constructor(public vals: OrderOptionArgs) {
        this.vals = vals;
        this.key = vals.keyPrefix ? `${vals.keyPrefix}.${vals.key}` : vals.key;
    }
}

export const makeOrderOption = (vals: OrderOptionArgs): OrderOption | undefined => {
    if (!vals) {
        return undefined;
    }

    const option = new OrderOption(vals);

    if (vals.followUp) {
        option.vals.followUpOption = makeOrderOption(vals.followUp);
    }

    if (vals.ifCond) {
        option.vals.ifFn = (state: any, prefix: string) => {
            return evalExpression(vals.ifCond, state, prefix) ? true : false;
        }
    }

    if (!vals.label) {
        throw new Error('Label is required');
    }

    if (!vals.key) {
        throw new Error('Key is required');
    }

    return option;
}

export const makeOrderSelection = (vals: OrderSelectionArgs): OrderSelection | undefined => {
    if (!vals) {
        return undefined;
    }

    const selection = new OrderSelection(vals);

    if (vals.followUp) {
        selection.vals.followUpOption = makeOrderOption(vals.followUp);
    }

    if (vals.ifCond) {
        selection.vals.ifFn = (state: any, prefix: string) => {
            return evalExpression(vals.ifCond, state, prefix) ? true : false;
        }
    }

    if (!vals.label) {
        throw new Error('Label is required');
    }

    if (!vals.value) {
        throw new Error('Value is required');
    }

    return selection;
}