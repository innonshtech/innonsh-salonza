import { LRUCache } from "lru-cache";
import { NextRequest, NextResponse } from "next/server";

const options = {
  max: 500,
  ttl: 1000 * 60, // 1 minute default TTL
};

const tokenCache = new LRUCache(options);

export function rateLimit(
  req: NextRequest,
  limit: number = 100,
  windowMs: number = 60 * 1000
) {
  // Use IP address if available, otherwise fallback to a default token
  const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "anonymous";
  const tokenCount = (tokenCache.get(ip) as number[]) || [0];
  
  if (tokenCount[0] === 0) {
    tokenCache.set(ip, tokenCount, { ttl: windowMs });
  }
  
  tokenCount[0] += 1;

  const currentUsage = tokenCount[0];
  const isRateLimited = currentUsage > limit;

  return {
    isRateLimited,
    currentUsage,
    limit,
    remaining: isRateLimited ? 0 : limit - currentUsage,
  };
}

/**
 * Middleware helper for specific rate limiting on API routes
 */
export function withRateLimit(handler: Function, limit: number, windowMs: number) {
  return async (req: NextRequest, ...args: any[]) => {
    const { isRateLimited } = rateLimit(req, limit, windowMs);

    if (isRateLimited) {
      return NextResponse.json(
        { success: false, message: "Too many requests, please try again later." },
        { status: 429, headers: { "Retry-After": Math.ceil(windowMs / 1000).toString() } }
      );
    }

    return handler(req, ...args);
  };
}
