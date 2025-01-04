import { gameState } from "..";

export const getMySessionKeyGroup = (sessionKey: string) => {
    if (!sessionKey.length) {
        return [];
    }
    if (!gameState.keyGroups) {
        gameState.keyGroups = [];
        return [];
    }
    return gameState.keyGroups.filter(group => group.includes(sessionKey)).flat();
}

export const getMyAdminKeyGroup = (sessionKey: string) => {
    if (!sessionKey.length) {
        return [];
    }
    if (!gameState!.adminKeyGroups) {
        gameState!.adminKeyGroups = [];
        return [];
    }
    return gameState!.adminKeyGroups.filter(group => group.includes(sessionKey)).flat();
}

export const keyIsAdmin = (sessionKey: string) => {
    if (!sessionKey.length) {
        return false;
    }
    if (!gameState!.adminKeyGroups) {
        gameState!.adminKeyGroups = [];
        return false;
    }
    return gameState!.adminKeyGroups.filter(group => group.includes(sessionKey)).flat().length > 0;
}

export const addAdmin = (sessionKey: string) => {
    if (!sessionKey.length) {
        return;
    }
    if (!gameState!.adminKeyGroups) {
        gameState!.adminKeyGroups = [[sessionKey]];
    }
    else {
        gameState!.adminKeyGroups.push([sessionKey]);
    }
}

export const addClient = (sessionKey: string) => {
    if (!gameState!.keyGroups) {
        gameState!.keyGroups = [[sessionKey]];
    }
    else {
        gameState!.keyGroups.push([sessionKey]);
    }
}

export const removeClient = (sessionKey: string) => {
    if (!sessionKey.length) {
        return;
    }
    if (!gameState!.keyGroups) {
        gameState!.keyGroups = [];
        return;
    }
    gameState!.keyGroups = gameState!.keyGroups.filter(group => !group.includes(sessionKey));
}

export const removeKeyForClient = (sessionKey: string) => {
    if (!sessionKey.length) {
        return;
    }
    if (!gameState!.keyGroups) {
        gameState!.keyGroups = [];
        return;
    }
    const character = gameState.characters.assigned[sessionKey];
    if (character) {
        delete gameState.characters.assigned[sessionKey];
        gameState.characters.unassigned.push(character);
    }
    const myGroup = gameState!.keyGroups.find(group => group.includes(sessionKey));
    if (myGroup) {
        myGroup.splice(myGroup.indexOf(sessionKey), 1);
    }
}

export const addKeyForClient = (sessionKey: string) => {
    if (!sessionKey.length) {
        return;
    }
    if (!gameState!.keyGroups) {
        gameState!.keyGroups = [];
        return;
    }
    const newKey = crypto.randomUUID();
    const myGroup = gameState!.keyGroups.find(group => group.includes(sessionKey));
    if (myGroup) {
        myGroup.push(newKey);
        return newKey;
    }
    else {
        return null;
    }
}

export const addKeyForAdmin = (sessionKey: string) => {
    if (!gameState!.adminKeyGroups) {
        gameState!.adminKeyGroups = [];
        return null;
    }
    const newKey = crypto.randomUUID();
    const myGroup = gameState!.adminKeyGroups.find(group => group.includes(sessionKey));
    if (myGroup) {
        myGroup.push(newKey);
        return newKey;
    }
    else {
        return null;
    }
}

export const removeAdmin = (sessionKey: string) => {
    if (!sessionKey.length) {
        return;
    }
    if (!gameState!.adminKeyGroups) {
        gameState!.adminKeyGroups = [];
        return;
    }
    gameState!.adminKeyGroups = gameState!.adminKeyGroups.filter(group => !group.includes(sessionKey));
}

export const removeKeyForAdmin = (sessionKey: string, key: string) => {
    if (!sessionKey.length || !key.length) {
        return;
    }
    if (!gameState!.adminKeyGroups) {
        gameState!.adminKeyGroups = [];
        return;
    }
    const myGroup = gameState!.adminKeyGroups.find(group => group.includes(sessionKey));
    if (myGroup) {
        myGroup.splice(myGroup.indexOf(key), 1);
    }
}