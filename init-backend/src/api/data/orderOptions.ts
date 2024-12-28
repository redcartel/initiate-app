import { RedisClientType } from "redis";
import fs from "fs";
import path from "path";
import yaml from "js-yaml";

const processOrderOptions = (orderOptions: any, _currentOrders: any) => {
    return orderOptions;
};

export const orderOptions = (redisClient: RedisClientType) => async (gameId: string, characterId: string) => {
    const orderOptions = await redisClient.get(`${gameId}:${characterId}:orderOptions`);
    const currentOrders = await redisClient.get(`${gameId}:${characterId}:currentOrders`);
    if (!orderOptions) {
        const optionsYaml = await redisClient.get(`${gameId}:${characterId}:characterSheet`) ?? 'default.yml';
        const options = await recursiveParseOptions$(optionsYaml);

        await redisClient.set(`${gameId}:${characterId}:orderOptions`, JSON.stringify(options), { EX: 60 * 60 * 24 });
        return processOrderOptions(options, currentOrders);
    }
    return processOrderOptions(orderOptions, currentOrders);
};

function recursiveParseOptions$(data: any) {
    if (typeof data === 'string') {
        const fileData = fs.readFileSync(path.join(process.cwd(), "config", "orderOptions", data), "utf8");
        const prefab = yaml.load(fileData);
        return recursiveParseOptions$(prefab);
    }

    Object.keys(data).forEach((key) => {
        if (key === 'prefab') {
            const fileData = fs.readFileSync(path.join(process.cwd(), "config", "orderOptions", data['prefab']), "utf8");
            const prefab = yaml.load(fileData);
            data[key] = recursiveParseOptions$(prefab);
        }
        else if (key === 'turnSequence') {
            const tmpData = data[key].map((turn: any) => {

                return recursiveParseOptions$(turn);
            });
            data[key] = tmpData;
        }
        else if (key === 'followUp') {
            if (typeof data[key] === 'string') {
                data[key] = recursiveParseOptions$(data[key]);
            }
        }
        else if (key === 'followUpSequence') {
            data[key] = data[key].map((followUp: any) => {
                if (typeof followUp === 'string') {
                    data[key] = recursiveParseOptions$(followUp);
                }

            });
        }
        else if (typeof data[key] === 'string' && /__.+__/.test(data[key])) {
            return [];
        }
        else {
            // pass
        }
    });

    return data;
}