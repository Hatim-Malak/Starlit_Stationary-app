import {Redis} from "@upstash/redis"

const redis = new Redis({ url: process.env.UPSTASH_REDIS_REST_URL, token: process.env.UPSTASH_REDIS_REST_TOKEN })

export const getCache = async (key) => {
  const cached = await redis.get(key)
  if (!cached) return null
  try {
    return JSON.parse(cached)
  } catch {
    return cached
  }
}

export const setCache = async (key, value, ttl = 60) => {
  const payload = typeof value === "string" ? value : JSON.stringify(value)
  await redis.set(key, payload, { ex: ttl })
}

export const delCache = async (...keys) => {
  if (keys.length === 0) return
  await redis.del(...keys)
}

export const cacheResponse = async (key, ttl, callback) => {
  const cached = await getCache(key)
  if (cached) return cached
  const value = await callback()
  if (value !== undefined) await setCache(key, value, ttl)
  return value
}
