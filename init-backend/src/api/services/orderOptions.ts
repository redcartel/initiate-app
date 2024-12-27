import { orderOptions } from "../data/orderOptions";
import { RedisClientType } from "redis";

export const getOrderOptions = (redis: RedisClientType) => async (gameId: string, characterId: string) => {
    const _orderOptions = await orderOptions(redis)(gameId, characterId);
    return _orderOptions;
}