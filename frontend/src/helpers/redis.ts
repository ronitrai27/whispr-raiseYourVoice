// lib/redis.ts
import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL as string); // redis://localhost:6379

redis.on("connect", () => {
  console.log("🔌 Redis connected");
});

redis.on("error", (err) => {
  console.error("❌ Redis error:", err);
});

export default redis;
