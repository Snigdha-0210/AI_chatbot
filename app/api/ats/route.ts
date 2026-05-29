import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { verifyBearerToken } from "@/utils/auth";
import { MAX_PDF_BYTES } from "@/utils/constants";
import { saveResume } from "@/utils/firestore-server";
import { getAdminStorage } from "@/utils/firebase-admin";
import { analyzeResume } from "@/lib/openai";
import { extractPdfText } from "@/utils/pdf";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const userId = await verifyBearerToken(req.headers.get("authorization"));
    const form = await req.formData();
    const file = form.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: "Upload a PDF file (field: file)" },
        { status: 400 }
      );
    }
    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Only PDF files are allowed" },
        { status: 400 }
      );
    }
    if (file.size === 0) {
      return NextResponse.json({ error: "File is empty" }, { status: 400 });
    }
    if (file.size > MAX_PDF_BYTES) {
      return NextResponse.json(
        { error: "File exceeds 5 MB limit" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    let text: string;
    try {
      text = await extractPdfText(buffer);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "PDF parse failed";
      return NextResponse.json({ error: msg }, { status: 400 });
    }

    const analysis = await analyzeResume(text);
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const storagePath = `resumes/${userId}/${randomUUID()}-${safeName}`;
    const bucket = getAdminStorage().bucket();
    await bucket.file(storagePath).save(buffer, {
      contentType: "application/pdf",
    });

    const resumeId = await saveResume(userId, analysis.score, analysis, {
      fileName: file.name,
      storagePath,
    });

    return NextResponse.json({ resumeId, ...analysis });
  } catch (err) {
    console.error("[api/ats]", err);
    const msg = err instanceof Error ? err.message : "ATS scan failed";
    const status = msg.includes("Authorization") ? 401 : 500;
    return NextResponse.json({ error: msg }, { status });
  }
}
