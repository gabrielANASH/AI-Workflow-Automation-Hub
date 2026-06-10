import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/auth/session";
import * as executionService from "@/lib/execution/service";
import { handleApiError } from "@/lib/api/error-handler";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const payload = await verifySession();
    let body: Record<string, unknown> = {};
    try {
      body = await request.json();
    } catch {
      // no body provided, use empty input
    }
    const run = await executionService.executeWorkflowById(id, payload.userId, body);
    return NextResponse.json({ run }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const payload = await verifySession();
    const runs = await executionService.listRunsByWorkflow(id, payload.userId);
    return NextResponse.json({ runs }, { status: 200 });
  } catch (error) {
    return handleApiError(error);
  }
}
