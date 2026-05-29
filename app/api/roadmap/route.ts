import { NextRequest, NextResponse } from "next/server";
import { verifyBearerToken } from "@/utils/auth";
import { saveAiResult } from "@/utils/firestore-server";
import { generateRoadmap } from "@/lib/openai";
import type { RoadmapContent } from "@/types";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const userId = await verifyBearerToken(req.headers.get("authorization"));
    const { role, timeframe } = await req.json();

    if (!role?.trim()) {
      return NextResponse.json({ error: "Role is required" }, { status: 400 });
    }

    const roleTrimmed = role.trim();
    const tf = timeframe?.trim() || undefined;
    const generated = await generateRoadmap(roleTrimmed, tf);
    const content: RoadmapContent = {
      role: roleTrimmed,
      timeframe: tf,
      ...generated,
    };
    const label = `${roleTrimmed} roadmap`;
    const resultId = await saveAiResult(userId, "roadmap", label, content);

    return NextResponse.json({ resultId, ...content });
  } catch (err) {
    console.error("[api/roadmap]", err);
    const msg = err instanceof Error ? err.message : "Failed to generate roadmap";
    const status = msg.includes("Authorization") ? 401 : 500;
    return NextResponse.json({ error: msg }, { status });
  }
}
