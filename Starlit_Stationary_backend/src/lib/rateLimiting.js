import {Redis} from "@upstash/redis"
import {Ratelimit} from "@upstash/ratelimit"

const redis = new Redis({ url: process.env.UPSTASH_REDIS_REST_URL, token: process.env.UPSTASH_REDIS_REST_TOKEN })

const createLimiter = (prefix, limit, window) => new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(limit, window),
  prefix,
})

export const authLimiter = createLimiter("limit:auth", 20, "15 m")
export const loginLimiter = createLimiter("limit:login", 5, "15 m")
export const logoutLimiter = createLimiter("limit:logout", 10, "15 m")
export const productLimiter = createLimiter("limit:product", 80, "1 m")
export const searchLimiter = createLimiter("limit:search", 30, "1 m")
export const categoryLimiter = createLimiter("limit:category", 40, "1 m")
export const featuredLimiter = createLimiter("limit:featured", 40, "1 m")
export const cartLimiter = createLimiter("limit:cart", 50, "1 m")
export const cartWriteLimiter = createLimiter("limit:cart-write", 30, "1 m")
export const orderLimiter = createLimiter("limit:order", 30, "1 m")
export const orderWriteLimiter = createLimiter("limit:order-write", 10, "1 m")
export const adminLimiter = createLimiter("limit:admin", 20, "1 m")
export const otpLimiter = createLimiter("limit:otp", 5, "1 m")

export const withRateLimit = (limiter) => async (req, res, next) => {
  try {
    const { success } = await limiter.limit(req.ip || "anonymous");
    if (!success) {
      return res.status(429).json({ message: "Rate limit exceeded" });
    }
    next();
  } catch (error) {
    console.error("Rate Limiter Error:", error);
    next(); 
  }
}
