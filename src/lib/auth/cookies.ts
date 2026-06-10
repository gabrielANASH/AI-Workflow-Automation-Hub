import { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { authConfig } from "./config";

type CookieOptions = Omit<ResponseCookie, "name" | "value">;

const baseOptions: CookieOptions = {
  httpOnly: authConfig.cookie.httpOnly,
  secure: authConfig.cookie.secure,
  sameSite: authConfig.cookie.sameSite,
  path: authConfig.cookie.path,
};

export function createAccessTokenCookie(token: string): ResponseCookie {
  return {
    name: authConfig.accessToken.cookieName,
    value: token,
    ...baseOptions,
    maxAge: authConfig.accessToken.maxAge,
  };
}

export function createRefreshTokenCookie(token: string): ResponseCookie {
  return {
    name: authConfig.refreshToken.cookieName,
    value: token,
    ...baseOptions,
    maxAge: authConfig.refreshToken.maxAge,
  };
}

export function clearAccessTokenCookie(): ResponseCookie {
  return {
    name: authConfig.accessToken.cookieName,
    value: "",
    ...baseOptions,
    maxAge: 0,
  };
}

export function clearRefreshTokenCookie(): ResponseCookie {
  return {
    name: authConfig.refreshToken.cookieName,
    value: "",
    ...baseOptions,
    maxAge: 0,
  };
}
