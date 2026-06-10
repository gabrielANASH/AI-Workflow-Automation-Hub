export const authConfig = {
  accessToken: {
    secret: process.env.ACCESS_TOKEN_SECRET || "dev-access-token-secret-change-in-production",
    expiresIn: "15m" as const,
    cookieName: "access_token",
    maxAge: 15 * 60,
  },
  refreshToken: {
    secret: process.env.REFRESH_TOKEN_SECRET || "dev-refresh-token-secret-change-in-production",
    expiresIn: "7d" as const,
    cookieName: "refresh_token",
    maxAge: 7 * 24 * 60 * 60,
  },
  bcrypt: {
    saltRounds: 12,
  },
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
  },
} as const;
