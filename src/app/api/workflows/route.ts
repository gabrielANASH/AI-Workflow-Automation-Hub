import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/auth/session";
import * as workflowService from "@/lib/workflows/service";
import { handleApiError } from "@/lib/api/error-handler";

export async function GET() {
  try {
    const payload = await verifySession();
    const workflows = await workflowService.listWorkflows(payload.userId);
    return NextResponse.json({ workflows }, { status: 200 });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload = await verifySession();
    const body = await request.json();
    const workflow = await workflowService.createWorkflow(body, payload.userId);
    return NextResponse.json({ workflow }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
