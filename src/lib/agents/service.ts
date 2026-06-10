import { AgentError } from "./errors";
import {
  createAgentSchema,
  updateAgentSchema,
  type CreateAgentInput,
  type UpdateAgentInput,
} from "./validation";
import * as repo from "./repository";
import { AgentModel } from "@prisma/client";

export type AgentResponse = {
  id: string;
  name: string;
  description: string | null;
  model: string;
  status: string;
  capabilities: string[];
  accuracy: number;
  tasks: number;
  lastUsed: string | null;
  createdAt: string;
};

const modelDisplayNames: Record<string, string> = {
  GPT4o: "GPT-4o",
  GPT4oMini: "GPT-4o Mini",
  Claude35Sonnet: "Claude 3.5 Sonnet",
  GeminiPro: "Gemini Pro",
  Custom: "Custom",
};

function toResponse(a: {
  id: string;
  name: string;
  description: string | null;
  model: string;
  status: string;
  capabilities: string[];
  accuracy: number;
  tasksCompleted: number;
  lastUsedAt: Date | null;
  createdAt: Date;
}): AgentResponse {
  return {
    id: a.id,
    name: a.name,
    description: a.description,
    model: modelDisplayNames[a.model] ?? a.model,
    status: a.status,
    capabilities: a.capabilities,
    accuracy: a.accuracy,
    tasks: a.tasksCompleted,
    lastUsed: a.lastUsedAt?.toISOString() ?? null,
    createdAt: a.createdAt.toISOString(),
  };
}

export async function listAgents(userId: string): Promise<AgentResponse[]> {
  const agents = await repo.findAgentsByUserId(userId);
  return agents.map(toResponse);
}

export async function getAgent(id: string, userId: string): Promise<AgentResponse> {
  const agent = await repo.findAgentByIdAndUser(id, userId);
  if (!agent) throw new AgentError("Agent not found", 404);
  return toResponse(agent);
}

export async function createAgent(
  input: CreateAgentInput,
  userId: string,
): Promise<AgentResponse> {
  const parsed = createAgentSchema.parse(input);
  const agent = await repo.createAgent({ ...parsed, userId });
  return toResponse(agent);
}

export async function updateAgent(
  id: string,
  input: UpdateAgentInput,
  userId: string,
): Promise<AgentResponse> {
  const parsed = updateAgentSchema.parse(input);
  const existing = await repo.findAgentByIdAndUser(id, userId);
  if (!existing) throw new AgentError("Agent not found", 404);
  const agent = await repo.updateAgent(id, userId, parsed);
  return toResponse(agent);
}

export async function deployAgent(id: string, userId: string): Promise<AgentResponse> {
  const existing = await repo.findAgentByIdAndUser(id, userId);
  if (!existing) throw new AgentError("Agent not found", 404);
  if (existing.status === "active") throw new AgentError("Agent is already deployed", 400);
  const agent = await repo.deployAgent(id, userId);
  return toResponse(agent);
}

export async function undeployAgent(id: string, userId: string): Promise<AgentResponse> {
  const existing = await repo.findAgentByIdAndUser(id, userId);
  if (!existing) throw new AgentError("Agent not found", 404);
  if (existing.status !== "active") throw new AgentError("Agent is not deployed", 400);
  const agent = await repo.undeployAgent(id, userId);
  return toResponse(agent);
}

export async function deleteAgent(id: string, userId: string): Promise<void> {
  const existing = await repo.findAgentByIdAndUser(id, userId);
  if (!existing) throw new AgentError("Agent not found", 404);
  await repo.deleteAgent(id, userId);
}
