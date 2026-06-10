import { NextResponse } from "next/server";
import { getMe } from "@/lib/auth/service";
import { verifySession } from "@/lib/auth/session";
import { handleApiError } from "@/lib/api/error-handler";

export async function GET() {
  try {
    const payload = await verifySession();
    const user = await getMe(payload.userId);

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    return handleApiError(error);
  }
}
