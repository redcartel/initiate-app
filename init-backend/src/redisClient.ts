import { createClient, RedisClientType } from "redis";

const client = createClient({
    url: (process.env.REDIS_HOST ?? 'redis://localhost') + ':' + (process.env.REDIS_PORT ?? '6379'),
    password: process.env.REDIS_PASSWORD ?? '',
}) as RedisClientType;

client.connect();

export { client };