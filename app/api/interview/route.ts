import { NextRequest, NextResponse } from "next/server";
import { verifyBearerToken } from "@/utils/auth";
import { COLLECTIONS } from "@/utils/constants";
import { getAdminDb } from "@/utils/firebase-admin";
import { saveAiResult } from "@/utils/firestore-server";
import { generateInterviewQuestions } from "@/lib/openai";
import type { InterviewContent } from "@/types";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const userId = await verifyBearerToken(req.headers.get("authorization"));
    const { role, difficulty, existing, resultId } = await req.json();

    if (!role?.trim()) {
      return NextResponse.json({ error: "Role is required" }, { status: 400 });
    }
    const diff = ["easy", "medium", "hard"].includes(difficulty)
      ? difficulty
      : "medium";

    const roleTrimmed = role.trim();
    const generated = await generateInterviewQuestions(
      roleTrimmed,
      diff,
      existing
    );

    let content: InterviewContent;
    let savedId: string;

    if (existing && resultId) {
      content = {
        role: roleTrimmed,
        difficulty: diff,
        technical: [...(existing.technical ?? []), ...generated.technical],
        behavioral: [...(existing.behavioral ?? []), ...generated.behavioral],
      };
      const ref = getAdminDb().collection(COLLECTIONS.aiResults).doc(resultId);
      const snap = await ref.get();
      if (!snap.exists || snap.data()?.userId !== userId) {
        throw new Error("Result not found");
      }
      await ref.update({ content });
      savedId = resultId;
    } else {
      content = {
        role: roleTrimmed,
        difficulty: diff,
        technical: generated.technical,
        behavioral: generated.behavioral,
      };
      const label = `${roleTrimmed} · ${diff}`;
      savedId = await saveAiResult(userId, "interview", label, content);
    }

    return NextResponse.json({ resultId: savedId, ...content });
  } catch (err) {
    console.error("[api/interview]", err);
    const msg = err instanceof Error ? err.message : "Failed to generate questions";
    const status = msg.includes("Authorization") ? 401 : 500;
    return NextResponse.json({ error: msg }, { status });
  }
}
