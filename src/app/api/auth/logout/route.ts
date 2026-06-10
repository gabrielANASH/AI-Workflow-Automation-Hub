import { NextRequest, NextResponse } from "next/server";
import { logout } from "@/lib/auth/service";
import { getRefreshToken } from "@/lib/auth/session";
import { clearAccessTokenCookie, clearRefreshTokenCookie } from "@/lib/auth/cookies";
import { handleApiError } from "@/lib/api/error-handler";

export async function POST(_request: NextRequest) {
  try {
    const refreshToken = await getRefreshToken();

    if (refreshToken) {
      await logout(refreshToken);
    }
  } catch (error) {
    handleApiError(error);
  }

  const response = NextResponse.json({ success: true }, { status: 200 });

  response.cookies.set(clearAccessTokenCookie());
  response.cookies.set(clearRefreshTokenCookie());

  return response;
}
