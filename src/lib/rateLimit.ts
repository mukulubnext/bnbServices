import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

export const rateLimiters = {
  auth: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, "1 m"), // 5 req/min
    prefix: "rl:auth",
  }),

  otp: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(3, "5 m"), // 3 req / 5 min
    prefix: "rl:otp",
  }),

  write: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(20, "1 m"),
    prefix: "rl:write",
  }),

  read: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(60, "1 m"),
    prefix: "rl:read",
  }),
};
