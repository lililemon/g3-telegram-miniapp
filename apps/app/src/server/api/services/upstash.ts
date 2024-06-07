import { Redis } from "@upstash/redis";
import { env } from "../../../env";

export enum Key {
  LEADERBOARD = "leaderboard",
}

const mapCacheKeyToTimeExpiry: Record<Key, number> = {
  [Key.LEADERBOARD]: 60,
};

const redis = new Redis({
  url: env.UPSTASH_REDIS_REST_URL,
  token: env.UPSTASH_REDIS_REST_TOKEN,
});

export const callOrGetFromCache = async <T>(
  key: Key,
  callback: () => Promise<T>,
): Promise<T> => {
  if (env.NEXT_PUBLIC_G3_ENV === "development") {
    return callback();
  }

  const cacheKey = key;
  const cacheValue = await redis.get(cacheKey);
  if (cacheValue) {
    return cacheValue as T;
  }

  const value = await callback();
  await redis.setex(cacheKey, mapCacheKeyToTimeExpiry[key], value);
  return value;
};
