import { gameState } from "..";

export const getMySessionKeyGroup = (sessionKey: string) => {
    return gameState.keyGroups.filter(group => group.includes(sessionKey)).flat();
}

export const getMyAdminKeyGroup = (sessionKey: string) => {
    return gameState.adminKeyGroups.filter(group => group.includes(sessionKey)).flat();
}

export const keyIsAdmin = (sessionKey: string) => {
    return gameState.adminKeyGroups.filter(group => group.includes(sessionKey)).flat().length > 0;
}

export const addAdmin = (sessionKey: string) => {
    if (!gameState.adminKeyGroups) {
        gameState.adminKeyGroups = [[sessionKey]];
    }
    else {
        gameState.adminKeyGroups.push([sessionKey]);
    }
}

export const addClient = (sessionKey: string) => {
    if (!gameState.keyGroups) {
        gameState.keyGroups = [[sessionKey]];
    }
    else {
        gameState.keyGroups.push([sessionKey]);
    }
}

export const removeClient = (sessionKey: string) => {
    gameState.keyGroups = gameState.keyGroups.filter(group => !group.includes(sessionKey));
}

export const removeKeyForClient = (sessionKey: string, key: string) => {
    const myGroup = gameState.keyGroups.find(group => group.includes(sessionKey));
    if (myGroup) {
        myGroup.splice(myGroup.indexOf(key), 1);
    }
}

export const addKeyForClient = (sessionKey: string) => {
    const newKey = crypto.randomUUID();
    const myGroup = gameState.keyGroups.find(group => group.includes(sessionKey));
    if (myGroup) {
        myGroup.push(newKey);
        return newKey;
    }
    else {
        return null;
    }
}

export const addKeyForAdmin = (sessionKey: string) => {
    const newKey = crypto.randomUUID();
    const myGroup = gameState.adminKeyGroups.find(group => group.includes(sessionKey));
    if (myGroup) {
        myGroup.push(newKey);
        return newKey;
    }
    else {
        return null;
    }
}

export const removeAdmin = (sessionKey: string) => {
    gameState.adminKeyGroups = gameState.adminKeyGroups.filter(group => !group.includes(sessionKey));
}

export const removeKeyForAdmin = (sessionKey: string, key: string) => {
    const myGroup = gameState.adminKeyGroups.find(group => group.includes(sessionKey));
    if (myGroup) {
        myGroup.splice(myGroup.indexOf(key), 1);
    }
}