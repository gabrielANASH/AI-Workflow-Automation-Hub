import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/auth/session";
import * as agentService from "@/lib/agents/service";
import { handleApiError } from "@/lib/api/error-handler";

type Params = Promise<{ id: string }>;

export async function GET(
  _request: NextRequest,
  { params }: { params: Params },
) {
  try {
    const { id } = await params;
    const payload = await verifySession();
    const agent = await agentService.getAgent(id, payload.userId);
    return NextResponse.json({ agent }, { status: 200 });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Params },
) {
  try {
    const { id } = await params;
    const payload = await verifySession();
    const body = await request.json();
    const agent = await agentService.updateAgent(id, body, payload.userId);
    return NextResponse.json({ agent }, { status: 200 });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Params },
) {
  try {
    const { id } = await params;
    const payload = await verifySession();
    await agentService.deleteAgent(id, payload.userId);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return handleApiError(error);
  }
}
