import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { authConfig } from "@/lib/auth/config";
import { checkRateLimit } from "@/lib/api/rate-limiter";
import { getSecurityHeaders } from "@/lib/api/security-headers";
import { generateRequestId, getRequestIdHeader } from "@/lib/api/request-id";

const publicPages = ["/", "/login", "/register"];
const authApiPaths = ["/api/auth/login", "/api/auth/register", "/api/auth/refresh"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const requestId = generateRequestId();
  const isApiRequest = pathname.startsWith("/api/");

  if (isApiRequest && pathname !== "/api/health") {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
      ?? request.headers.get("x-real-ip")
      ?? "unknown";
    const rateKey = `${ip}:${pathname}`;
    const result = checkRateLimit(rateKey, 100, 60000);

    if (!result.allowed) {
      return NextResponse.json(
        { error: "Too many requests", requestId },
        {
          status: 429,
          headers: {
            "Retry-After": String(Math.ceil(result.resetMs / 1000)),
            "X-RateLimit-Limit": String(result.limit),
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": String(result.resetMs),
            [getRequestIdHeader()]: requestId,
          },
        },
      );
    }
  }

  const response = NextResponse.next();

  response.headers.set(getRequestIdHeader(), requestId);

  const securityHeaders = getSecurityHeaders(process.env.NODE_ENV === "production");
  for (const [key, value] of Object.entries(securityHeaders)) {
    response.headers.set(key, value);
  }

  if (publicPages.includes(pathname)) {
    return response;
  }

  if (authApiPaths.some((p) => pathname.startsWith(p))) {
    return response;
  }

  const accessToken = request.cookies.get(authConfig.accessToken.cookieName)?.value;

  if (!accessToken) {
    if (isApiRequest) {
      return NextResponse.json({ error: "Unauthorized", requestId }, { status: 401 });
    }

    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
