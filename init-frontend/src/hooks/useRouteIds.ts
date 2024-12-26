
const useRouteIds = () => {
    if (window.location.pathname.split('/').length > 2) {
        const gameId = window.location.pathname.split('/')[1];
        const characterId = window.location.pathname.split('/')[2];
        return { gameId, characterId };
    }
    else if (window.location.pathname.split('/').length > 1) {
        const gameId = window.location.pathname.split('/')[1];
        return { gameId, characterId: null };
    }
    return { gameId: null, characterId: null };
}

export default useRouteIds;