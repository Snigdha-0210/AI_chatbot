import { NextRequest, NextResponse } from "next/server";
import { verifyBearerToken } from "@/utils/auth";
import { upsertUser } from "@/utils/firestore-server";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const uid = await verifyBearerToken(req.headers.get("authorization"));
    await upsertUser(uid);
    return NextResponse.json({ ok: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to sync user";
    const status = msg.includes("Authorization") ? 401 : 500;
    return NextResponse.json({ error: msg }, { status });
  }
}
