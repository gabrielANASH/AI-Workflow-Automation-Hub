import { NextResponse } from "next/server";
import { verifySession } from "@/lib/auth/session";
import * as executionService from "@/lib/execution/service";
import { handleApiError } from "@/lib/api/error-handler";

export async function GET() {
  try {
    const payload = await verifySession();
    const runs = await executionService.listAllRuns(payload.userId);
    return NextResponse.json({ runs }, { status: 200 });
  } catch (error) {
    return handleApiError(error);
  }
}
