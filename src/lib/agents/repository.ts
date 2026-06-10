import { db } from "@/lib/db";
import type { CreateAgentInput, UpdateAgentInput } from "./validation";

export function findAgentsByUserId(userId: string) {
  return db.agent.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
  });
}

export function findAgentByIdAndUser(id: string, userId: string) {
  return db.agent.findFirst({
    where: { id, userId },
  });
}

export function createAgent(data: CreateAgentInput & { userId: string }) {
  return db.agent.create({
    data: {
      name: data.name,
      description: data.description ?? null,
      model: data.model,
      status: data.status ?? "inactive",
      capabilities: data.capabilities ?? [],
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      config: (data.config ?? undefined) as any,
      userId: data.userId,
    },
  });
}

export function updateAgent(
  id: string,
  userId: string,
  data: UpdateAgentInput,
) {
  return db.agent.update({
    where: { id, userId },
    data: {
      ...(data.name !== undefined && { name: data.name }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.model !== undefined && { model: data.model }),
      ...(data.status !== undefined && { status: data.status }),
      ...(data.capabilities !== undefined && { capabilities: data.capabilities }),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ...(data.config !== undefined && { config: data.config as any }),
    },
  });
}

export function deployAgent(id: string, userId: string) {
  return db.agent.update({
    where: { id, userId },
    data: {
      status: "active",
      lastUsedAt: new Date(),
    },
  });
}

export function undeployAgent(id: string, userId: string) {
  return db.agent.update({
    where: { id, userId },
    data: {
      status: "inactive",
    },
  });
}

export function deleteAgent(id: string, userId: string) {
  return db.agent.delete({
    where: { id, userId },
  });
}
