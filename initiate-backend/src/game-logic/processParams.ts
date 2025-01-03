import { OrderContent } from "../../../initiate-client/src/QueryTypes/getResponse";
import { specialKeys } from "../consts";
import { Params } from "../processGet";
import { Character } from "../types";
import { getCharacterFromSessionKey } from "./getCharacter";
import { getPathOrder } from "./getPathOrder";
import { keyIsAdmin } from "./sessionKeys";

export type ProcessedParams = {
    sessionKey: string,
    path: string,
    pathSegments: string[],
    layout: 'basic' | 'admin' | 'client',
    section?: string,
    phase?: string,
    isAdmin: boolean,
    character?: Character,
    forbidden: boolean,
    needCharacter: boolean,
    orderStep: OrderContent | null,
    value: string | null,
    values: string[] | null,
    valueIsSpecial: boolean
}

export const processParams = (params: Params, body?: { value?: string | string[] }) : ProcessedParams => {
    const sessionKey = decodeURIComponent(params.sessionKey);
    let path = decodeURIComponent(params.path);
    const pathSegments = path.split('/');
    path = pathSegments.join('/');
    const isAdmin = sessionKey ? keyIsAdmin(sessionKey) : false;
    const character = sessionKey ? (getCharacterFromSessionKey(sessionKey).character ?? undefined) : undefined;
    const layout = pathSegments.length === 0 ? 'basic' : pathSegments[0] as 'basic' | 'admin' | 'client';
    const section = pathSegments.length === 0 ? undefined : pathSegments[1];
    const phase = pathSegments.length < 2  ? undefined : pathSegments[2];
    const value = body?.value ? Array.isArray(body.value) ? body.value.join('::') : body.value : null;
    const values = body?.value ? Array.isArray(body.value) ? body.value : null : null;
    const valueIsSpecial = value && Object.values(specialKeys).includes(value);

    let forbidden = false;
    let needCharacter = false;
    let orderStep: OrderContent | null = null;
    if (layout === 'admin' && !isAdmin) {
        forbidden = true;
    }
    if (layout === 'client' && (isAdmin || !sessionKey)) {
        console.log('processParams client without session or admin client access');
        forbidden = true;
    }
    if (!isAdmin && sessionKey && !character) {
        console.log('processParams client without character');
        needCharacter = true;
    }
    if (layout === 'client' && !character && section === 'turn') {
        console.log('processParams client turn without character');
        forbidden = true;
    }
    if (layout === 'client' && character && section === 'turn') {
        orderStep = getPathOrder(path, sessionKey);
    }

    
    return {
        sessionKey,
        path,
        pathSegments,
        layout,
        section,
        phase,
        isAdmin,
        character,
        forbidden,
        needCharacter,
        orderStep,
        value,
        values,
        valueIsSpecial: valueIsSpecial ? true : false
    }
}