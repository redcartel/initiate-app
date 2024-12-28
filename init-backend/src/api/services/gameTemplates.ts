
import { generateId } from "./generateId";
import { getYaml } from "./yamlAccess";

export const applyTemplate = (template: string) => {
    let gameTemplate: any;

    try {
        gameTemplate = getYaml(`/config/games/game.${template}.yaml`);
    }
    catch (e) {
        if (e instanceof Error && e.message.includes('ENOENT')) {
            gameTemplate = getYaml(`/config/games/game.${template}.yml`);
        }
        else throw e;
    }

    const game = {
        ...(gameTemplate as any),
        template: template
    }

    game.characters = gameTemplate.characters.map((character: any) => ({
        ...character,
        id: generateId()
    }));

    Promise.all(game.characters.map(async (character: any) => {
        let characterSheet: any;
        try {
            characterSheet = await getYaml(`/config/${character.characterSheet}`);
        }
        catch (e) {
            if (e instanceof Error && e.message.includes('ENOENT')) {
                characterSheet = await getYaml(`/config/${character.characterSheet}`);
            }
            else throw e;
        }
        return {
            ...character,
            id: generateId(),
            characterSheet: characterSheet
        }
    }));

    return game;
}