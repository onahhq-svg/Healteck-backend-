import rateLimit from "express-rate-limit";
import RedisStore from "rate-limit-redis";
import IORedis from "ioredis";

const createStore = () => {
  if (process.env.REDIS_URL) {
    const client = new IORedis(process.env.REDIS_URL);
    return new RedisStore({ sendCommand: (...args) => client.call(...args) });
  }
  return undefined; // express-rate-limit will use in-memory store
};

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // stricter for auth routes
  standardHeaders: true,
  legacyHeaders: false,
  store: createStore(),
  message: { message: "Too many auth requests, please try again later." },
});

export const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  store: createStore(),
  message: { message: "Too many requests, please try again later." },
});

export default { authLimiter, apiLimiter };
