import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/auth/session";
import * as agentService from "@/lib/agents/service";
import { handleApiError } from "@/lib/api/error-handler";

export async function GET() {
  try {
    const payload = await verifySession();
    const agents = await agentService.listAgents(payload.userId);
    return NextResponse.json({ agents }, { status: 200 });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload = await verifySession();
    const body = await request.json();
    const agent = await agentService.createAgent(body, payload.userId);
    return NextResponse.json({ agent }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
