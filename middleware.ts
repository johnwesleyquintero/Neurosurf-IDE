import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
  try {
    const token = await getToken({ req: request })
    const isAuthenticated = !!token

    // Protect routes that require authentication
    if (!isAuthenticated && !request.nextUrl.pathname.startsWith("/login")) {
      const loginUrl = new URL("/login", request.url)
      return NextResponse.redirect(loginUrl)
    }

    // Redirect authenticated users away from login page
    if (isAuthenticated && request.nextUrl.pathname.startsWith("/login")) {
      const homeUrl = new URL("/", request.url)
      return NextResponse.redirect(homeUrl)
    }

    return NextResponse.next()
  } catch (error) {
    console.error("Authentication middleware error:", error)
    // Fail safe to login page on error
    const loginUrl = new URL("/login", request.url)
    return NextResponse.redirect(loginUrl)
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api routes that don't require authentication
     */
    "/((?!_next/static|_next/image|favicon.ico|public|api/auth).*)",
  ],
}

