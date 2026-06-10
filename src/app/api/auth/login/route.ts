import { NextRequest, NextResponse } from "next/server";
import { login } from "@/lib/auth/service";
import { createAccessTokenCookie, createRefreshTokenCookie } from "@/lib/auth/cookies";
import { handleApiError } from "@/lib/api/error-handler";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const userAgent = request.headers.get("user-agent") ?? undefined;
    const ip = request.headers.get("x-forwarded-for") ?? request.headers.get("x-real-ip") ?? undefined;

    const result = await login(body, userAgent, ip);

    const response = NextResponse.json(
      { user: result.user },
      { status: 200 },
    );

    response.cookies.set(createAccessTokenCookie(result.accessToken));
    response.cookies.set(createRefreshTokenCookie(result.refreshToken));

    return response;
  } catch (error) {
    return handleApiError(error);
  }
}
