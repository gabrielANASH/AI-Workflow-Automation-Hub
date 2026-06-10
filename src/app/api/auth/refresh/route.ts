import { NextRequest, NextResponse } from "next/server";
import { refresh } from "@/lib/auth/service";
import { AuthError } from "@/lib/auth/errors";
import { getRefreshToken } from "@/lib/auth/session";
import { createAccessTokenCookie, createRefreshTokenCookie, clearAccessTokenCookie, clearRefreshTokenCookie } from "@/lib/auth/cookies";
import { handleApiError } from "@/lib/api/error-handler";

export async function POST(request: NextRequest) {
  try {
    const oldRefreshToken = await getRefreshToken();

    if (!oldRefreshToken) {
      return NextResponse.json(
        { error: "No refresh token" },
        { status: 401 },
      );
    }

    const userAgent = request.headers.get("user-agent") ?? undefined;
    const ip = request.headers.get("x-forwarded-for") ?? request.headers.get("x-real-ip") ?? undefined;

    const result = await refresh(oldRefreshToken, userAgent, ip);

    const response = NextResponse.json(
      { user: result.user },
      { status: 200 },
    );

    response.cookies.set(createAccessTokenCookie(result.accessToken));
    response.cookies.set(createRefreshTokenCookie(result.refreshToken));

    return response;
  } catch (error) {
    if (error instanceof AuthError) {
      const response = NextResponse.json(
        { error: error.message },
        { status: error.statusCode },
      );

      response.cookies.set(clearAccessTokenCookie());
      response.cookies.set(clearRefreshTokenCookie());

      return response;
    }

    return handleApiError(error);
  }
}
