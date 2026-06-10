import { db } from "@/lib/db";
import { AuthError } from "./errors";
import { registerSchema, loginSchema, type RegisterInput, type LoginInput } from "./validation";
import { hashPassword, verifyPassword } from "./password";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  createSession,
  rotateRefreshToken,
  deleteSession,
} from "./tokens";

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  avatarUrl: string | null;
  createdAt: Date;
};

export type AuthResult = {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
};

function sanitizeUser(user: {
  id: string;
  email: string;
  name: string;
  avatarUrl: string | null;
  createdAt: Date;
}): AuthUser {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    avatarUrl: user.avatarUrl,
    createdAt: user.createdAt,
  };
}

export async function register(
  input: RegisterInput,
  userAgent?: string,
  ip?: string,
): Promise<AuthResult> {
  const parsed = registerSchema.parse(input);

  const existing = await db.user.findUnique({
    where: { email: parsed.email },
  });

  if (existing) {
    throw new AuthError("Email already registered", 409);
  }

  const passwordHash = await hashPassword(parsed.password);

  const user = await db.user.create({
    data: {
      name: parsed.name,
      email: parsed.email,
      passwordHash,
    },
  });

  const accessToken = signAccessToken({ userId: user.id, email: user.email });

  const refreshToken = signRefreshToken({
    userId: user.id,
    sessionId: crypto.randomUUID(),
  });

  await createSession(user.id, refreshToken, userAgent, ip);

  return {
    user: sanitizeUser(user),
    accessToken,
    refreshToken,
  };
}

export async function login(
  input: LoginInput,
  userAgent?: string,
  ip?: string,
): Promise<AuthResult> {
  const parsed = loginSchema.parse(input);

  const user = await db.user.findUnique({
    where: { email: parsed.email },
  });

  if (!user) {
    throw new AuthError("Invalid email or password", 401);
  }

  if (!user.isActive) {
    throw new AuthError("Account is deactivated", 403);
  }

  const valid = await verifyPassword(parsed.password, user.passwordHash);

  if (!valid) {
    throw new AuthError("Invalid email or password", 401);
  }

  const accessToken = signAccessToken({ userId: user.id, email: user.email });

  const refreshToken = signRefreshToken({
    userId: user.id,
    sessionId: crypto.randomUUID(),
  });

  await createSession(user.id, refreshToken, userAgent, ip);

  return {
    user: sanitizeUser(user),
    accessToken,
    refreshToken,
  };
}

export async function logout(refreshToken: string) {
  try {
    const payload = verifyRefreshToken(refreshToken);
    await deleteSession(payload.sessionId);
  } catch {
    // Silently clear invalid tokens
  }
}

export async function refresh(
  oldRefreshToken: string,
  userAgent?: string,
  ip?: string,
): Promise<AuthResult> {
  let payload: ReturnType<typeof verifyRefreshToken>;

  try {
    payload = verifyRefreshToken(oldRefreshToken);
  } catch {
    throw new AuthError("Invalid refresh token", 401);
  }

  const user = await db.user.findUnique({
    where: { id: payload.userId },
  });

  if (!user || !user.isActive) {
    throw new AuthError("User not found or deactivated", 401);
  }

  const rotated = await rotateRefreshToken(
    oldRefreshToken,
    user.id,
    payload.sessionId,
    userAgent,
    ip,
  );

  if (!rotated) {
    throw new AuthError("Session not found", 401);
  }

  const accessToken = signAccessToken({ userId: user.id, email: user.email });

  return {
    user: sanitizeUser(user),
    accessToken,
    refreshToken: rotated.refreshToken,
  };
}

export async function getMe(userId: string): Promise<AuthUser> {
  const user = await db.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new AuthError("User not found", 404);
  }

  return sanitizeUser(user);
}
