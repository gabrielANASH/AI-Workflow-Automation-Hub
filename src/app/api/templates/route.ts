import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/auth/session";
import * as templateService from "@/lib/templates/service";
import { handleApiError } from "@/lib/api/error-handler";

export async function GET() {
  try {
    const payload = await verifySession();
    const templates = await templateService.listTemplates(payload.userId);
    return NextResponse.json({ templates }, { status: 200 });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload = await verifySession();
    const body = await request.json();
    const template = await templateService.createTemplate(body, payload.userId);
    return NextResponse.json({ template }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
