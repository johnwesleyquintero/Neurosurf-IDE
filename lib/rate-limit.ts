import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

type RateLimitConfig = {
  limit: number
  windowMs: number
}

const ipRequests = new Map<string, { count: number; resetTime: number }>()

export function rateLimit(config: RateLimitConfig) {
  return async (request: NextRequest) => {
    const ip = request.ip ?? "127.0.0.1"
    const now = Date.now()
    const windowStart = now - config.windowMs

    // Clean up old entries
    for (const [key, data] of ipRequests.entries()) {
      if (data.resetTime < now) {
        ipRequests.delete(key)
      }
    }

    // Get or create rate limit data for this IP
    const rateLimitInfo = ipRequests.get(ip) ?? {
      count: 0,
      resetTime: now + config.windowMs,
    }

    // Check if limit is exceeded
    if (rateLimitInfo.count >= config.limit) {
      return new NextResponse(
        JSON.stringify({
          error: "Too many requests",
          retryAfter: Math.ceil((rateLimitInfo.resetTime - now) / 1000),
        }),
        {
          status: 429,
          headers: {
            "Retry-After": Math.ceil((rateLimitInfo.resetTime - now) / 1000).toString(),
          },
        },
      )
    }

    // Update rate limit info
    rateLimitInfo.count++
    ipRequests.set(ip, rateLimitInfo)

    return null // Continue to the next middleware/handler
  }
}

