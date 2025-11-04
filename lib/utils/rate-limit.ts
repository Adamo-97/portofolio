// lib/utils/rate-limit.ts
/**
 * In-memory rate limiting utility
 * WARNING: This resets on server restart. Use Redis in production.
 * 
 * For production, consider:
 * - Upstash Redis: https://upstash.com
 * - Vercel KV: https://vercel.com/storage/kv
 * - Redis Cloud: https://redis.com
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

// In-memory store (resets on deploy)
const store = new Map<string, RateLimitEntry>();

// Cleanup old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store.entries()) {
    if (now > entry.resetAt) {
      store.delete(key);
    }
  }
}, 5 * 60 * 1000);

export interface RateLimitOptions {
  /**
   * Maximum number of requests allowed in the time window
   * @default 5
   */
  limit?: number;
  
  /**
   * Time window in milliseconds
   * @default 600000 (10 minutes)
   */
  windowMs?: number;
  
  /**
   * Custom identifier (defaults to IP address)
   */
  identifier?: string;
}

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetAt: number;
}

/**
 * Check if a request should be rate limited
 * @param identifier - Unique identifier (usually IP address)
 * @param options - Rate limit configuration
 * @returns RateLimitResult with success status and remaining attempts
 */
export function checkRateLimit(
  identifier: string,
  options: RateLimitOptions = {}
): RateLimitResult {
  const { limit = 5, windowMs = 10 * 60 * 1000 } = options;
  const now = Date.now();
  
  const entry = store.get(identifier);
  
  // No entry or expired - create new
  if (!entry || now > entry.resetAt) {
    const resetAt = now + windowMs;
    store.set(identifier, { count: 1, resetAt });
    return { success: true, remaining: limit - 1, resetAt };
  }
  
  // Check if limit exceeded
  if (entry.count >= limit) {
    return { success: false, remaining: 0, resetAt: entry.resetAt };
  }
  
  // Increment count
  entry.count += 1;
  return { success: true, remaining: limit - entry.count, resetAt: entry.resetAt };
}

/**
 * Get IP address from request
 * Works with Vercel, Cloudflare, and other proxies
 */
export function getClientIp(request: Request): string {
  // Check headers in order of preference
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  
  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp.trim();
  }
  
  const cfConnecting = request.headers.get("cf-connecting-ip");
  if (cfConnecting) {
    return cfConnecting.trim();
  }
  
  return "unknown";
}

/**
 * Express-style middleware for API routes
 * @example
 * export async function POST(req: Request) {
 *   const rateLimit = createRateLimitMiddleware({ limit: 10, windowMs: 60000 });
 *   const result = rateLimit(req);
 *   
 *   if (!result.success) {
 *     return NextResponse.json(
 *       { error: "Too many requests" }, 
 *       { status: 429, headers: { "Retry-After": String(Math.ceil((result.resetAt - Date.now()) / 1000)) } }
 *     );
 *   }
 *   // ... handle request
 * }
 */
export function createRateLimitMiddleware(options: RateLimitOptions = {}) {
  return (request: Request): RateLimitResult => {
    const identifier = options.identifier || getClientIp(request);
    return checkRateLimit(identifier, options);
  };
}

/**
 * Reset rate limit for a specific identifier
 * Useful for testing or manual intervention
 */
export function resetRateLimit(identifier: string): void {
  store.delete(identifier);
}

/**
 * Get current rate limit status without incrementing
 */
export function getRateLimitStatus(identifier: string): RateLimitResult | null {
  const entry = store.get(identifier);
  if (!entry) return null;
  
  const now = Date.now();
  if (now > entry.resetAt) {
    store.delete(identifier);
    return null;
  }
  
  return {
    success: entry.count < 5, // default limit
    remaining: Math.max(0, 5 - entry.count),
    resetAt: entry.resetAt,
  };
}
