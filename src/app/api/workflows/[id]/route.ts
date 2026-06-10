import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/auth/session";
import * as workflowService from "@/lib/workflows/service";
import { handleApiError } from "@/lib/api/error-handler";

type Params = Promise<{ id: string }>;

export async function GET(
  _request: NextRequest,
  { params }: { params: Params },
) {
  try {
    const { id } = await params;
    const payload = await verifySession();
    const workflow = await workflowService.getWorkflowDetail(id, payload.userId);
    return NextResponse.json({ workflow }, { status: 200 });
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
    const workflow = await workflowService.updateWorkflow(id, body, payload.userId);
    return NextResponse.json({ workflow }, { status: 200 });
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
    await workflowService.deleteWorkflow(id, payload.userId);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return handleApiError(error);
  }
}
