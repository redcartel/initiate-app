import yaml from 'js-yaml';
import fs from 'fs';
import path from 'path';

const getYaml = (filePath: string) => {
    const file = fs.readFileSync(path.join(process.cwd(), filePath), 'utf8');
    return yaml.load(file);
}

const getGameTemplate = (gameName: string) => {
    return getYaml(`/config/games/game.${gameName}.yaml`);
}

const getGameTemplateList = () => {
    const files = fs.readdirSync(path.join(process.cwd(), '/config/games'));

    console.log(files)

    const templates = files.filter(file => /^game\..*\.ya?ml/.test(file)).map(file => file.replace(/\.ya?ml$/, '').replace(/^game\./, ''));

    console.log(templates)

    return templates;
}

export { getYaml, getGameTemplate, getGameTemplateList }