import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { authConfig } from "./config";
import { db } from "@/lib/db";

export type AccessTokenPayload = {
  userId: string;
  email: string;
};

export type RefreshTokenPayload = {
  userId: string;
  sessionId: string;
};

export function signAccessToken(payload: AccessTokenPayload): string {
  return jwt.sign(payload, authConfig.accessToken.secret, {
    expiresIn: authConfig.accessToken.expiresIn,
  });
}

export function signRefreshToken(payload: RefreshTokenPayload): string {
  return jwt.sign(payload, authConfig.refreshToken.secret, {
    expiresIn: authConfig.refreshToken.expiresIn,
  });
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  return jwt.verify(
    token,
    authConfig.accessToken.secret,
  ) as AccessTokenPayload;
}

export function verifyRefreshToken(token: string): RefreshTokenPayload {
  return jwt.verify(
    token,
    authConfig.refreshToken.secret,
  ) as RefreshTokenPayload;
}

export async function hashRefreshToken(token: string): Promise<string> {
  return bcrypt.hash(token, 10);
}

export async function createSession(
  userId: string,
  refreshToken: string,
  userAgent?: string,
  ip?: string,
) {
  const hashedToken = await hashRefreshToken(refreshToken);

  const session = await db.session.create({
    data: {
      userId,
      refreshToken: hashedToken,
      userAgent: userAgent ?? null,
      ip: ip ?? null,
      expiresAt: new Date(Date.now() + authConfig.refreshToken.maxAge * 1000),
    },
  });

  return session;
}

export async function rotateRefreshToken(
  oldToken: string,
  userId: string,
  oldSessionId: string,
  userAgent?: string,
  ip?: string,
) {
  const oldHash = await hashRefreshToken(oldToken);

  const existing = await db.session.findFirst({
    where: {
      id: oldSessionId,
      userId,
      refreshToken: oldHash,
    },
  });

  if (!existing) {
    return null;
  }

  await db.session.delete({ where: { id: existing.id } });

  const newRefreshToken = signRefreshToken({
    userId,
    sessionId: existing.id,
  });

  const session = await createSession(userId, newRefreshToken, userAgent, ip);

  return {
    refreshToken: newRefreshToken,
    session,
  };
}

export async function deleteSession(sessionId: string) {
  await db.session.delete({ where: { id: sessionId } }).catch(() => {});
}
