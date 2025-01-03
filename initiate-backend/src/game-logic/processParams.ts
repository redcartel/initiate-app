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
    forbiddenRedirect?: string,
    forbiddenErrorMsg?: string,
    needCharacter: boolean,
    orderStep: OrderContent | null,
    value: string | null,
    values: string[] | null,
    valueIsSpecial: boolean,
    specialKeySegment: typeof specialKeys[keyof typeof specialKeys] | null
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
    let forbiddenRedirect: string | null = null;
    let forbiddenErrorMsg: string | null = null;
    let needCharacter = false;
    let orderStep: OrderContent | null = null;
    if (layout === 'admin' && !isAdmin) {
        if (layout === 'admin' && !isAdmin) {
            if (character) {
                forbiddenRedirect = '/client/turn';
                forbidden = true;
                forbiddenErrorMsg = 'You are not an admin';
            }
            else if (sessionKey) {
                forbiddenRedirect = '/basic/character';
                forbidden = true;
                forbiddenErrorMsg = 'You are not an admin';
            }
            else {
                forbiddenRedirect = '/basic/join';
                forbidden = true;
                forbiddenErrorMsg = 'You are not an admin';
            }
        }
    }
    if (layout === 'client' && (isAdmin || !sessionKey)) {
        console.log('processParams client without session or admin client access');
        forbiddenRedirect = '/';
        forbidden = true;
        forbiddenErrorMsg = 'You do not have a session';
    }
    if (!isAdmin && sessionKey && !character) {
        console.log('processParams client without character');
        forbiddenRedirect = '/basic/character';
        needCharacter = true;
        forbiddenErrorMsg = 'You must pick a character before you can continue';
    }
    if (layout === 'client' && !character && section === 'turn') {
        console.log('processParams client turn without character');
        forbiddenRedirect = '/basic/character';
        forbidden = true;
        forbiddenErrorMsg = 'You must pick a character before you can continue';
    }
    if (layout === 'client' && character && section === 'turn') {
        orderStep = getPathOrder(path, sessionKey);
    }
    let specialKeySegment: typeof specialKeys[keyof typeof specialKeys] | null = null;
    if (pathSegments.length > 0 && Object.values(specialKeys).includes(pathSegments[pathSegments.length - 1])) {
        specialKeySegment = pathSegments[pathSegments.length - 1] as typeof specialKeys[keyof typeof specialKeys];
    }


    const processedParams: ProcessedParams = {
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
        valueIsSpecial: valueIsSpecial ? true : false,
        specialKeySegment
    }


    console.log('processedParams', processedParams);
    return processedParams;
}