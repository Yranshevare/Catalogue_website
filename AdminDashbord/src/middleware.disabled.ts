import { NextRequest, NextResponse } from "next/server"

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Allow access to login page and API routes
  if (pathname === "/login" || pathname.startsWith("/api")) {
    return NextResponse.next()
  }

  const refreshToken = request.cookies.get("refreshToken")

  if (!refreshToken) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/dashboard",
    "/dashboard/products",
    "/dashboard/categories",
    "/dashboard/notifications",
    "/dashboard/analytics",
    "/dashboard/settings",
  ],
}

