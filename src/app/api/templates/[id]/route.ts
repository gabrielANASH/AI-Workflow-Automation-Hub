import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/auth/session";
import * as templateService from "@/lib/templates/service";
import { handleApiError } from "@/lib/api/error-handler";

type Params = Promise<{ id: string }>;

export async function GET(
  _request: NextRequest,
  { params }: { params: Params },
) {
  try {
    const { id } = await params;
    await verifySession();
    const template = await templateService.getTemplate(id);
    return NextResponse.json({ template }, { status: 200 });
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
    const template = await templateService.updateTemplate(id, body);
    return NextResponse.json({ template }, { status: 200 });
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
    await verifySession();
    await templateService.deleteTemplate(id);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(
  _request: NextRequest,
  { params }: { params: Params },
) {
  try {
    const { id } = await params;
    const payload = await verifySession();
    const result = await templateService.duplicateTemplate(id, payload.userId);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
