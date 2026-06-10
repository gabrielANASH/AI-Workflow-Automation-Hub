import { cookies } from "next/headers";
import { authConfig } from "./config";
import { verifyAccessToken, type AccessTokenPayload } from "./tokens";
import { AuthError } from "./errors";

export async function getAccessToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(authConfig.accessToken.cookieName)?.value;
}

export async function getRefreshToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(authConfig.refreshToken.cookieName)?.value;
}

export async function verifySession(): Promise<AccessTokenPayload> {
  const token = await getAccessToken();

  if (!token) {
    throw new AuthError("No access token", 401);
  }

  try {
    return verifyAccessToken(token);
  } catch {
    throw new AuthError("Invalid or expired access token", 401);
  }
}
