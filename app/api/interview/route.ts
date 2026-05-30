import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const roleId = body.roleId as string;
    const level = body.level as string || "Entry-Level";

    if (!roleId?.trim()) {
      return NextResponse.json(
        { success: false, error: "RoleId is required" },
        { status: 400 }
      );
    }

    const dataDir = path.join(process.cwd(), "data", "interviews");
    let targetFile = path.join(dataDir, `${roleId}.json`);

    if (!fs.existsSync(targetFile)) {
      console.warn(`[api/interview] Missing dataset for role: ${roleId}. Falling back to general.json`);
      targetFile = path.join(dataDir, `general.json`);
    }

    if (!fs.existsSync(targetFile)) {
      return NextResponse.json(
        { success: false, error: "Interview datasets missing from server" },
        { status: 500 }
      );
    }

    const fileContent = fs.readFileSync(targetFile, "utf-8");
    const dataset = JSON.parse(fileContent);

    // Dynamic Level Filtering
    // If it's an internship, we can filter out Hard coding questions
    if (level === "Internship") {
      dataset.technicalQuestions = dataset.technicalQuestions.filter((q: any) => q.difficulty !== "Hard");
      dataset.codingQuestions = dataset.codingQuestions.filter((q: any) => q.difficulty !== "Hard");
    } else if (level === "Senior") {
      // If senior, filter out Easy
      dataset.technicalQuestions = dataset.technicalQuestions.filter((q: any) => q.difficulty !== "Easy");
      dataset.codingQuestions = dataset.codingQuestions.filter((q: any) => q.difficulty !== "Easy");
    }

    return NextResponse.json({
      success: true,
      data: dataset
    });
  } catch (err) {
    console.error("[api/interview]", err);
    return NextResponse.json(
      { success: false, error: "Unexpected error" },
      { status: 500 }
    );
  }
}
