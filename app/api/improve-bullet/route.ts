import { NextRequest, NextResponse } from "next/server";
import { verifyBearerToken } from "@/utils/auth";
import { saveAiResult } from "@/utils/firestore-server";
import { improveBullet } from "@/lib/openai";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const userId = await verifyBearerToken(req.headers.get("authorization"));
    const { bullet } = await req.json();

    if (!bullet?.trim()) {
      return NextResponse.json(
        { error: "Bullet text is required" },
        { status: 400 }
      );
    }

    const input = bullet.trim();
    const output = await improveBullet(input);
    const label = input.slice(0, 48) + (input.length > 48 ? "…" : "");
    const resultId = await saveAiResult(userId, "bullet", label, {
      input,
      output,
    });

    return NextResponse.json({ resultId, input, output });
  } catch (err) {
    console.error("[api/improve-bullet]", err);
    const msg = err instanceof Error ? err.message : "Failed to improve bullet";
    const status = msg.includes("Authorization") ? 401 : 500;
    return NextResponse.json({ error: msg }, { status });
  }
}
