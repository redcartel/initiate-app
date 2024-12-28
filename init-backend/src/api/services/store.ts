import { RedisClientType } from "redis";

export const get = (client: RedisClientType) => async (key: string) => {
    const value = await client.get(key);
    console.log('get', key, `>${value}< : ${value === null}`);
    if (value === null) {
        return null;
    }
    const result = JSON.parse(value ? value : '""');
    console.log('get', key, `>${result}<`);
    return result;
}

export const set = (client: RedisClientType) => async (key: string, value: any, expiration = 60 * 60 * 24 * 7) => {
    console.log('set', key, value, expiration);
    await client.set(key, JSON.stringify(value), { EX: expiration });
}